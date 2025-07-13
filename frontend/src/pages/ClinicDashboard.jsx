
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Add,
  Work,
  People,
  Pending,
  CheckCircle,
  Cancel,
  Visibility,
  Edit,
  TrendingUp,
  Assessment,
  Person,
  Schedule
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import useApplications from '../hooks/useApplications';
import { formatDate, formatCurrency } from '../utils/helpers';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const {
    applications,
    loading,
    error,
    stats,
    getDashboardStats
  } = useApplications();

  const [gigs, setGigs] = useState([]);
  const [gigsLoading, setGigsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    fetchGigs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      await getDashboardStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchGigs = async () => {
    try {
      setGigsLoading(true);
      const response = await fetch('/api/gigs/my-gigs');
      const data = await response.json();

      if (data.success) {
        setGigs(data.gigs);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setGigsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'accepted':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const pieData = [
    { name: 'Pending', value: stats.pending, color: '#ff9800' },
    { name: 'Accepted', value: stats.accepted, color: '#4caf50' },
    { name: 'Rejected', value: stats.rejected, color: '#f44336' }
  ];

  const barData = gigs.slice(0, 5).map(gig => ({
    name: gig.title.substring(0, 15) + (gig.title.length > 15 ? '...' : ''),
    applications: gig.applicationCount || 0
  }));

  return (
    <Box maxWidth="xl" mx="auto" p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Clinic Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your healthcare job postings and applications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/clinic/gigs/new')}
          size="large"
        >
          Post New Gig
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Applications
                  </Typography>
                  <Typography variant="h4">
                    {stats.total}
                  </Typography>
                </Box>
                <People color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Review
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.pending}
                  </Typography>
                </Box>
                <Pending color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Accepted
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.accepted}
                  </Typography>
                </Box>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Gigs
                  </Typography>
                  <Typography variant="h4">
                    {gigs.filter(g => g.status === 'active').length}
                  </Typography>
                </Box>
                <Work color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
          <Tab 
            label={
              <Badge badgeContent={stats.pending} color="warning">
                Pending Applications
              </Badge>
            }
          />
          <Tab label="My Gigs" />
          <Tab label="Recent Activity" />
        </Tabs>
      </Paper>

      {/* Pending Applications Tab */}
      {currentTab === 0 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Applications Requiring Review
              </Typography>
              {stats.pending > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/clinic/applications')}
                  endIcon={<Visibility />}
                >
                  View All
                </Button>
              )}
            </Box>

            {applications.length > 0 ? (
              <List>
                {applications
                  .filter(app => app.status === 'pending')
                  .slice(0, 5)
                  .map((application, index) => (
                    <React.Fragment key={application._id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={application.providerId?.profilePicture}>
                            <Person />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1">
                                {application.providerId?.firstName} {application.providerId?.lastName}
                              </Typography>
                              <Chip
                                size="small"
                                label="Pending"
                                color="warning"
                                icon={<Pending />}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Applied for: {application.gigId?.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(application.appliedAt)}
                              </Typography>
                            </Box>
                          }
                        />
                        <Box>
                          <Tooltip title="View Application">
                            <IconButton
                              onClick={() => navigate(`/clinic/gigs/${application.gigId._id}/applications`)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      {index < applications.filter(app => app.status === 'pending').slice(0, 5).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  No pending applications at the moment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Applications will appear here when healthcare providers apply for your gigs
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ClinicDashboard;
