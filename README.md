
# CareLink Zambia MVP - Healthcare Gig Platform

A comprehensive healthcare staffing platform connecting healthcare providers with medical facilities in Zambia.

## 🚀 Features

### Core Functionality
- **Gig Application Workflow**: Complete end-to-end application process
- **Role-Based Access Control**: Separate interfaces for clinics and healthcare providers
- **Real-time Notifications**: Instant updates on application status changes
- **Application Management**: Accept/reject applications with audit logging
- **Dashboard Analytics**: Comprehensive stats and insights for clinics

### Security & Performance
- JWT-based authentication with role-based authorization
- Rate limiting and input validation
- Audit logging for all critical actions
- Responsive design for mobile and desktop
- Error handling and user feedback throughout

## 🏗️ Architecture

### Backend (Node.js/Express)
```
backend/
├── controllers/
│   └── applicationController.js    # Application management logic
├── middleware/
│   └── auth.js                    # Authentication & authorization
├── models/
│   └── Application.js             # Application data model
├── routes/
│   └── applications.js            # API endpoints
└── server.js                      # Main server file
```

### Frontend (React)
```
frontend/src/
├── components/
│   ├── Applications.jsx           # Application management interface
│   ├── GigDetail.jsx             # Gig details with application status
│   ├── Navbar.jsx                # Navigation component
│   └── NotificationSystem.jsx    # Real-time notifications
├── hooks/
│   ├── useApplications.js        # Application management logic
│   └── useAuth.js                # Authentication logic
├── pages/
│   └── ClinicDashboard.jsx       # Clinic dashboard with analytics
└── utils/
    ├── api.js                    # API configuration
    └── helpers.js                # Utility functions
```

## 📋 API Endpoints

### Application Management
- `POST /api/applications/gigs/:gigId/apply` - Apply for a gig
- `GET /api/applications/gigs/:gigId/applications` - Get gig applications (clinic only)
- `PATCH /api/applications/applications/:applicationId/status` - Update application status
- `GET /api/applications/my-applications` - Get provider applications
- `GET /api/applications/gigs/:gigId/application-status` - Check application status
- `GET /api/applications/clinic/dashboard-stats` - Get clinic dashboard stats

### Authentication & Authorization
- Role-based access control (clinic/provider)
- JWT token authentication
- Rate limiting on sensitive endpoints
- Input validation and sanitization

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Configuration
```env
# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carelink-zambia
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

## 🎯 User Workflows

### Healthcare Provider Workflow
1. **Browse Gigs**: View available healthcare positions
2. **Apply for Gigs**: Submit applications with cover letters
3. **Track Applications**: Monitor application status in real-time
4. **Receive Notifications**: Get instant updates on application decisions

### Clinic Workflow
1. **Post Gigs**: Create healthcare job postings
2. **Manage Applications**: Review applicant profiles and qualifications
3. **Accept/Reject Applicants**: Make hiring decisions with optional notes
4. **Dashboard Analytics**: Track application metrics and performance
5. **Bulk Actions**: Process multiple applications efficiently

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token handling
- Role-based access control (RBAC)
- Protected routes and API endpoints
- Session management with automatic logout

### Data Protection
- Input validation and sanitization
- Rate limiting to prevent abuse
- Audit logging for sensitive operations
- CORS configuration for secure cross-origin requests

### Error Handling
- Comprehensive error handling throughout the application
- User-friendly error messages
- Development vs production error reporting
- Graceful fallbacks for failed operations

## 📊 Features Overview

### Application Status Management
- **Pending**: Initial application state
- **Accepted**: Clinic accepts the application
- **Rejected**: Clinic rejects the application
- Real-time status updates with notifications

### Dashboard Analytics
- Total applications count
- Pending applications requiring review
- Accepted vs rejected application ratios
- Recent activity timeline
- Application trends and insights

### Notification System
- Real-time status update notifications
- Email notifications (configurable)
- In-app notification center
- Notification preferences and settings

## 🧪 Testing

### Manual Testing Workflow
1. **Setup Test Environment**
   - Start backend server
   - Start frontend application
   - Ensure MongoDB is running

2. **Test Provider Workflow**
   - Register as healthcare provider
   - Browse and apply for gigs
   - Check application status
   - Receive status update notifications

3. **Test Clinic Workflow**
   - Register as clinic
   - Post new healthcare gigs
   - Review incoming applications
   - Accept/reject applications
   - Use bulk actions for efficiency

### Key Test Scenarios
- Application submission and status updates
- Role-based access control
- Real-time notifications
- Dashboard analytics
- Error handling and edge cases

## 🚦 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "stack": "..." // Only in development
}
```

## 🔄 Development Status

### ✅ Completed Features
- Complete application workflow
- Role-based authentication
- Real-time notifications
- Dashboard analytics
- Comprehensive error handling
- API documentation
- Security implementation

### 🚧 Ready for Testing
- End-to-end application workflow
- Role-based access control
- Real-time status updates
- Dashboard functionality
- Security measures

## 📞 Support

For technical support or questions about the CareLink Zambia MVP:
- Review the API documentation
- Check the error logs for debugging
- Test the complete workflow end-to-end
- Verify all security measures are working

## 🔮 Future Enhancements

- WebSocket integration for real-time updates
- Email notification system
- Advanced search and filtering
- Mobile application
- Payment processing integration
- Advanced analytics and reporting
#   e f f e c t i v e - p o t a t o  
 #   e f f e c t i v e - p o t a t o  
 #   e f f e c t i v e - p o t a t o  
 