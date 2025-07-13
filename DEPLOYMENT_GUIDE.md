
# CareLink Zambia MVP - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 16+ and npm
- MongoDB 4.4+
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt recommended)
- Domain name configured

### 1. Server Setup

#### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Database Setup

#### Configure MongoDB
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
> use carelink-zambia
> db.createUser({
    user: "carelink_user",
    pwd: "secure_password_here",
    roles: [
      {
        role: "readWrite",
        db: "carelink-zambia"
      }
    ]
  })
> exit
```

### 3. Application Deployment

#### Clone and Setup Backend
```bash
# Create application directory
sudo mkdir -p /var/www/carelink-zambia
sudo chown -R $USER:$USER /var/www/carelink-zambia

# Clone repository (replace with your actual repo)
cd /var/www/carelink-zambia
git clone <your-repository-url> .

# Setup backend
cd backend
npm install --production

# Create production environment file
cp .env.example .env
nano .env
```

#### Production Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://carelink_user:secure_password_here@localhost:27017/carelink-zambia
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRE=7d
FRONTEND_URL=https://your-domain.com
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

#### Setup Frontend
```bash
cd ../frontend
npm install
npm run build

# Move build files to Nginx directory
sudo cp -r build/* /var/www/html/
```

### 4. Process Management with PM2

#### Backend Process Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'carelink-backend',
    script: './backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/carelink/error.log',
    out_file: '/var/log/carelink/out.log',
    log_file: '/var/log/carelink/combined.log',
    time: true
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/carelink
sudo chown -R $USER:$USER /var/log/carelink

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Nginx Configuration

#### Create Nginx Configuration
```bash
sudo tee /etc/nginx/sites-available/carelink-zambia << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;

    # Frontend
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/carelink-zambia /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate Setup

#### Install Certbot and Get SSL Certificate
```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Firewall Configuration

```bash
# Configure UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 27017  # MongoDB (restrict to localhost in production)
sudo ufw status
```

### 8. Monitoring and Logging

#### Setup Log Rotation
```bash
sudo tee /etc/logrotate.d/carelink << EOF
/var/log/carelink/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

#### MongoDB Monitoring
```bash
# Create MongoDB monitoring script
cat > /home/$USER/monitor-mongodb.sh << EOF
#!/bin/bash
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Starting..."
    sudo systemctl start mongod
    echo "MongoDB restarted at \$(date)" >> /var/log/carelink/mongodb-restarts.log
fi
EOF

chmod +x /home/$USER/monitor-mongodb.sh

# Add to crontab
(crontab -l ; echo "*/5 * * * * /home/$USER/monitor-mongodb.sh") | crontab -
```

### 9. Backup Strategy

#### Database Backup Script
```bash
cat > /home/$USER/backup-database.sh << EOF
#!/bin/bash
BACKUP_DIR="/var/backups/carelink"
DATE=\$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="carelink_backup_\$DATE.gz"

mkdir -p \$BACKUP_DIR

mongodump --host localhost --port 27017 --db carelink-zambia --username carelink_user --password secure_password_here --out \$BACKUP_DIR/temp_\$DATE

tar -czf \$BACKUP_DIR/\$BACKUP_FILE -C \$BACKUP_DIR temp_\$DATE
rm -rf \$BACKUP_DIR/temp_\$DATE

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "carelink_backup_*.gz" -mtime +7 -delete

echo "Backup completed: \$BACKUP_FILE"
EOF

chmod +x /home/$USER/backup-database.sh

# Schedule daily backups
(crontab -l ; echo "0 2 * * * /home/$USER/backup-database.sh") | crontab -
```

### 10. Performance Optimization

#### Enable Redis for Session Management (Optional)
```bash
# Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server

# Update backend to use Redis sessions
npm install redis connect-redis express-session
```

### 11. Health Checks

#### Create Health Check Endpoint
```bash
# Add to your monitoring system
curl -f http://localhost:5000/api/health || exit 1
```

### 12. Deployment Checklist

- [ ] Server dependencies installed
- [ ] MongoDB configured and secured
- [ ] Application code deployed
- [ ] Environment variables configured
- [ ] PM2 process manager setup
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Health checks configured
- [ ] Performance optimization applied

### 13. Post-Deployment Testing

```bash
# Test API endpoints
curl -X GET https://your-domain.com/api/health

# Test frontend
curl -X GET https://your-domain.com

# Test application functionality
# - User registration and login
# - Gig creation and application
# - Real-time notifications
# - Dashboard functionality
```

### 14. Troubleshooting

#### Common Issues
```bash
# Check PM2 status
pm2 status
pm2 logs

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check MongoDB status
sudo systemctl status mongod
mongo --eval "db.runCommand('ping')"

# Check application logs
tail -f /var/log/carelink/combined.log
```

### 15. Maintenance

#### Regular Maintenance Tasks
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Node.js dependencies
cd /var/www/carelink-zambia/backend
npm audit
npm update

# Clean up logs
sudo journalctl --vacuum-time=30d

# Check disk space
df -h
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **Database Security**: Use strong passwords and limit access
3. **SSL/TLS**: Always use HTTPS in production
4. **Firewall**: Restrict unnecessary ports
5. **Updates**: Keep all dependencies up to date
6. **Monitoring**: Implement comprehensive logging and monitoring
7. **Backups**: Regular automated backups with tested restore procedures

## 📞 Production Support

- Monitor application health regularly
- Set up alerts for critical issues
- Implement automated deployments
- Maintain documentation up to date
- Regular security audits
