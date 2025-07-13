
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Work,
  Dashboard,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', mr: 4 }}
          onClick={() => navigate('/')}
        >
          CareLink Zambia
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<Work />}
            onClick={() => navigate('/gigs')}
            sx={{
              backgroundColor: isActive('/gigs') ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Browse Gigs
          </Button>

          {user?.role === 'clinic' && (
            <Button
              color="inherit"
              startIcon={<Dashboard />}
              onClick={() => navigate('/clinic/dashboard')}
              sx={{
                backgroundColor: isActive('/clinic/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              Dashboard
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar
                  src={user.profilePicture}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="subtitle2">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>
                </MenuItem>

                <Divider />

                <MenuItem onClick={() => {
                  handleClose();
                  navigate('/profile');
                }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
