
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components and pages
import { NotificationProvider } from './components/NotificationSystem';
import { AuthProvider, useAuth } from './hooks/useAuth';
import GigDetail from './components/GigDetail';
import Applications from './components/Applications';
import ClinicDashboard from './pages/ClinicDashboard';
import Navbar from './components/Navbar';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      Loading...
    </Box>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1, pt: 2 }}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Navigate to="/gigs" replace />} />
                  <Route path="/gigs/:id" element={<GigDetail />} />

                  {/* Clinic Routes */}
                  <Route 
                    path="/clinic/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['clinic']}>
                        <ClinicDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/clinic/gigs/:gigId/applications" 
                    element={
                      <ProtectedRoute allowedRoles={['clinic']}>
                        <Applications />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Provider Routes */}
                  <Route 
                    path="/provider/applications" 
                    element={
                      <ProtectedRoute allowedRoles={['provider']}>
                        <div>Provider Applications Page</div>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Fallback Routes */}
                  <Route path="/login" element={<div>Login Page</div>} />
                  <Route path="/register" element={<div>Register Page</div>} />
                  <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                  <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
              </Box>
            </Box>
          </Router>

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
