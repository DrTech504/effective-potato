
# CareLink Zambia MVP - Testing Guide

## 🧪 Complete Testing Workflow

### Prerequisites
1. MongoDB running locally or connection string configured
2. Backend server running on port 5000
3. Frontend application running on port 3000

### Phase 1: Environment Setup
```bash
# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
```

### Phase 2: Authentication Testing

#### Test User Registration
1. Navigate to `/register`
2. Register as Healthcare Provider:
   - Email: provider@test.com
   - Password: TestPass123!
   - Role: Healthcare Provider
   - Complete profile information

3. Register as Clinic:
   - Email: clinic@test.com
   - Password: TestPass123!
   - Role: Healthcare Clinic
   - Complete clinic information

#### Test Login
1. Login with both accounts
2. Verify role-based redirects
3. Test logout functionality

### Phase 3: Gig Management (Clinic Account)

#### Create Test Gigs
```json
{
  "title": "Emergency Room Nurse - Night Shift",
  "description": "Urgent need for experienced ER nurse for night shifts at Lusaka General Hospital",
  "requirements": "3+ years ER experience, BLS certification required",
  "location": "Lusaka, Zambia",
  "compensation": 2500,
  "startDate": "2024-01-15",
  "deadline": "2024-01-10",
  "duration": "3 months",
  "skills": ["Emergency Care", "BLS", "Patient Assessment"]
}
```

#### Test Clinic Dashboard
1. Access `/clinic/dashboard`
2. Verify stats display correctly
3. Check gig listings
4. Test navigation to applications

### Phase 4: Application Workflow (Provider Account)

#### Test Gig Application
1. Browse gigs at `/gigs`
2. Click on a gig to view details
3. Submit application with cover letter
4. Verify application status updates

#### Test Application Status
1. Check application shows "Pending" status
2. Verify Apply button is disabled after application
3. Check notification appears

### Phase 5: Application Management (Clinic Account)

#### Test Application Review
1. Navigate to `/clinic/gigs/{gigId}/applications`
2. Verify applicant information displays
3. Test individual Accept/Reject actions
4. Add notes to decisions

#### Test Bulk Actions
1. Select multiple pending applications
2. Use bulk Accept/Reject functionality
3. Verify status updates correctly

### Phase 6: Real-time Notifications

#### Test Status Update Notifications
1. As clinic: Accept/reject applications
2. As provider: Verify notifications appear
3. Test notification history
4. Check email notifications (if configured)

### Phase 7: API Endpoint Testing

#### Test Application Endpoints
```bash
# Get application status
GET /api/applications/gigs/{gigId}/application-status
Authorization: Bearer {token}

# Apply for gig
POST /api/applications/gigs/{gigId}/apply
Authorization: Bearer {token}
Content-Type: application/json
{
  "coverLetter": "I am interested in this position..."
}

# Get gig applications (clinic only)
GET /api/applications/gigs/{gigId}/applications
Authorization: Bearer {token}

# Update application status (clinic only)
PATCH /api/applications/applications/{applicationId}/status
Authorization: Bearer {token}
Content-Type: application/json
{
  "status": "accepted",
  "notes": "Great qualifications!"
}
```

### Phase 8: Security Testing

#### Test Authentication
1. Try accessing protected routes without token
2. Test with invalid/expired tokens
3. Verify role-based access restrictions

#### Test Rate Limiting
1. Make rapid API requests
2. Verify rate limiting kicks in
3. Test different endpoints

#### Test Input Validation
1. Submit invalid data to forms
2. Test SQL injection attempts
3. Verify error handling

### Phase 9: Error Handling

#### Test Error Scenarios
1. Network disconnection
2. Server errors
3. Invalid data submission
4. Unauthorized access attempts

### Phase 10: Performance Testing

#### Test Load Scenarios
1. Multiple simultaneous applications
2. Bulk operations
3. Dashboard with large datasets
4. Real-time notifications under load

## 📊 Expected Results

### Successful Application Workflow
1. Provider can apply for gigs
2. Application status updates in real-time
3. Clinics can manage applications efficiently
4. Notifications work correctly
5. All security measures function properly

### Key Metrics to Verify
- Application submission success rate: 100%
- Status update latency: < 2 seconds
- Dashboard load time: < 3 seconds
- API response time: < 500ms
- Error handling coverage: All scenarios

## 🐛 Common Issues & Solutions

### Database Connection Issues
```bash
# Check MongoDB status
mongod --version
# Verify connection string in .env
```

### Authentication Problems
```bash
# Check JWT secret configuration
# Verify token expiration settings
# Clear localStorage if needed
```

### API Errors
```bash
# Check server logs
# Verify request headers
# Test with Postman/curl
```

## ✅ Testing Checklist

- [ ] User registration and login
- [ ] Role-based access control
- [ ] Gig creation and management
- [ ] Application submission
- [ ] Application status updates
- [ ] Real-time notifications
- [ ] Dashboard analytics
- [ ] Bulk operations
- [ ] Error handling
- [ ] Security measures
- [ ] Mobile responsiveness
- [ ] Performance benchmarks

## 📝 Test Report Template

### Test Summary
- **Date**: 
- **Tester**: 
- **Environment**: 
- **Test Duration**: 

### Results
- **Total Tests**: 
- **Passed**: 
- **Failed**: 
- **Critical Issues**: 

### Issues Found
1. **Issue**: Description
   **Severity**: High/Medium/Low
   **Status**: Open/Fixed

### Recommendations
- Performance improvements
- Security enhancements
- User experience optimizations
