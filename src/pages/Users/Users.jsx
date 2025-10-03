import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api';
import './Users.css';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';


// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ minWidth: 200, height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Box 
          bgcolor={`${color}.light`} 
          color={`${color}.dark`} 
          p={1.5} 
          borderRadius="50%"
          mr={2}
        >
          <Icon />
        </Box>
        <Box>
          <Typography color="textSecondary" variant="body2">
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Users = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [userTests, setUserTests] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Admin management state
  const [admins, setAdmins] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [deleteAdminDialog, setDeleteAdminDialog] = useState({ open: false, admin: null });

  useEffect(() => {
    let isMounted = true;
    let refreshInterval;

    const fetchStats = async () => {
      try {
        console.log('Fetching user stats...');
        const response = await api.get('/users/stats');
        
        if (isMounted) {
          console.log('Fetched stats:', response.data);
          if (response.data && response.data.success && response.data.data) {
            const statsData = response.data.data;
            console.log('User Stats:', statsData.userStats);
            console.log('Recent Tests:', statsData.recentTests);
            
            // Debug individual user stats
            if (statsData.userStats && statsData.userStats.length > 0) {
              console.log('User Statistics Summary:');
              console.table(statsData.userStats.map(user => ({
                Name: user.name || 'Unknown',
                'Test Count': user.testCount || 0,
                'Avg Score': user.averageScore !== undefined ? `${Math.round(user.averageScore * 10) / 10}%` : 'N/A',
                'Last Login': user.lastLogin ? new Date(user.lastLogin).toISOString() : 'Never',
                'User ID': user.userId
              })));
            }
            
            setStats(statsData);
            setError(null);
          } else {
            console.error('Unexpected API response format:', response.data);
            setError('Received unexpected data format from server');
          }
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
        if (isMounted) {
          setError('Failed to load user statistics. Retrying...');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchStats();

    // Set up auto-refresh every 30 seconds
    refreshInterval = setInterval(() => {
      fetchStats();
    }, 30000);

        const fetchAdmins = async () => {
      if (!isMounted) return;
      setAdminLoading(true);
      try {
        const response = await api.get('/admin/all');
        if (response.data?.success) {
          setAdmins(response.data.data);
        }
      } catch (err) {
        setAdminError('Failed to load admins.');
      } finally {
        if (isMounted) setAdminLoading(false);
      }
    };

    if (tabValue === 3) {
        fetchAdmins();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
    const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 3) { // Admin Management Tab
      fetchAdmins();
    }
  };

  const fetchAdmins = async () => {
      setAdminLoading(true);
      try {
        const response = await api.get('/admin/all');
        if (response.data?.success) {
          setAdmins(response.data.data);
        }
      } catch (err) {
        setAdminError('Failed to load admins.');
        setSnackbar({ open: true, message: 'Failed to load admins.', severity: 'error' });
      } finally {
        setAdminLoading(false);
      }
    };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPassword) {
        setSnackbar({ open: true, message: 'Email and password are required.', severity: 'warning' });
        return;
    }
    try {
        const response = await api.post('/admin/create', { 
            email: newAdminEmail, 
            password: newAdminPassword 
        });
        if (response.data?.success) {
            setSnackbar({ open: true, message: 'Admin created successfully!', severity: 'success' });
            setNewAdminEmail('');
            setNewAdminPassword('');
            fetchAdmins(); // Refresh the list
        }
    } catch (err) {
        setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to create admin.', severity: 'error' });
    }
  };

  const handleDeleteAdmin = (admin) => {
    setDeleteAdminDialog({ open: true, admin });
  };

  const confirmDeleteAdmin = async () => {
    if (!deleteAdminDialog.admin?._id) {
      setDeleteAdminDialog({ open: false, admin: null });
      return;
    }

    try {
      const response = await api.delete(`/admin/${deleteAdminDialog.admin._id}`);
      if (response.data?.success) {
        setSnackbar({ 
          open: true, 
          message: 'Admin deleted successfully.', 
          severity: 'success' 
        });
        fetchAdmins(); // Refresh list
      }
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to delete admin.', 
        severity: 'error' 
      });
    }
    setDeleteAdminDialog({ open: false, admin: null });
  };

  const fetchUserTestHistory = async (userId, userName) => {
    try {
      console.log(`Fetching test history for user: ${userId}`);
      const response = await api.get(`/admin/users/${userId}/tests`);
      
      setUserTests(prev => ({
        ...prev,
        [userId]: {
          userName,
          tests: response.data.data?.tests || [],
          lastFetched: Date.now()
        }
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching user test history:', err);
      setError('Failed to load test history. Please try again.');
    }
  };

  const handleViewUserTests = (userId, userName) => {
    // Always switch to the test history tab immediately for better UX
    setTabValue(1);
    
    // If we already have recent tests for this user, use them
    if (userTests[userId] && userTests[userId].lastFetched > Date.now() - 30000) {
      console.log('Using cached test history for user:', userId);
      return;
    }

    // Otherwise, fetch fresh test history
    fetchUserTestHistory(userId, userName);
  };

  const handleDeactivateUser = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const confirmDeactivateUser = async () => {
    try {
      const { user } = deleteDialog;
      console.log('Deactivating user:', user.userId);
      
      // Update endpoint to match backend route with /api prefix
      const response = await api.delete(`/api/admin/users/${user.userId}`);
      
      if (response.data && response.data.success) {
        // Remove user from the stats
        setStats(prevStats => ({
          ...prevStats,
          userStats: prevStats.userStats.filter(u => u.userId !== user.userId),
          totalUsers: prevStats.totalUsers - 1
        }));
        setSnackbar({
          open: true,
          message: `User ${user.name} has been deactivated successfully`,
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error deactivating user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to deactivate user. Please try again.',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, user: null });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDebugData = async () => {
    try {
      console.log('Fetching debug data...');
      const response = await api.get('/debug');
      console.log('Debug data:', response.data);
      setSnackbar({
        open: true,
        message: 'Debug data logged to console. Check browser console.',
        severity: 'info'
      });
    } catch (err) {
      console.error('Debug error:', err);
      setSnackbar({
        open: true,
        message: 'Debug request failed. Check console.',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date Error';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Loading user statistics...</Typography>
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error" variant="h6" gutterBottom>
          {error || 'Failed to load user statistics'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Please check your internet connection and try again.
        </Typography>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          User Statistics
        </Typography>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={handleDebugData}
          size="small"
        >
          Debug Data
        </Button>
      </Box>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={PeopleIcon} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Active Users (30d)" 
            value={stats?.activeUsers || 0} 
            icon={PersonIcon} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="Total Tests Taken" 
            value={stats?.totalTestsTaken || 0} 
            icon={AssignmentIcon} 
            color="warning"
          />
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Users" />
          <Tab label="Test History" />
                    <Tab label="Recent Tests" />
          <Tab label="Admin Management" icon={<SupervisorAccountIcon />} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Tests Taken</TableCell>
                    <TableCell align="right">Avg. Score</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.userStats?.length > 0 ? (
                    stats.userStats.map((user) => (
                      <TableRow key={user.userId} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            {user.name || 'Unknown User'}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email || 'No email'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role || 'student'} 
                            color={user.role === 'admin' ? 'error' : user.role === 'teacher' ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={user.testCount || 0} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {user.averageScore !== undefined && user.averageScore !== null ? (
                            <Chip 
                              label={`${Math.round(user.averageScore * 10) / 10}%`} 
                              color={user.averageScore >= 70 ? 'success' : user.averageScore >= 50 ? 'warning' : 'error'}
                              variant="filled"
                              size="small"
                              title={`Based on ${user.testCount || 0} tests`}
                            />
                          ) : (
                            <Chip 
                              label="No data" 
                              color="default"
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleViewUserTests(user.userId, user.name)}
                              className="view-tests-btn"
                              disabled={!user.testCount}
                              title="View test history"
                            >
                              <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} />
                              View Tests
                            </button>
                            {user.role !== 'admin' && (
                              <button 
                                onClick={() => handleDeactivateUser(user)}
                                className="deactivate-btn"
                                title="Deactivate user"
                              >
                                <DeleteIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                Deactivate
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Box textAlign="center">
                          <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            No users found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Users will appear here once they register.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Test History
          </Typography>
          {Object.keys(userTests).length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(userTests).map(([userId, data]) => (
                    <React.Fragment key={userId}>
                      <TableRow>
                        <TableCell colSpan={4} sx={{ fontWeight: 'bold', bgcolor: 'action.hover' }}>
                          {data.userName}'s Test History
                        </TableCell>
                      </TableRow>
                      {data.tests.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>{test.test || 'Unknown Test'}</TableCell>
                          <TableCell align="right">{test.score}/{test.totalQuestions}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${test.percentage}%`}
                              color={test.percentage >= 70 ? 'success' : test.percentage >= 50 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(test.submittedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={4}>
              <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No test history selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on "View Tests" next to a user to see their test history.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Recent Test Submissions
          </Typography>
          {stats?.recentTests?.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Test</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.recentTests.map((test, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                            {test.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </Avatar>
                          {test.user?.name || 'Unknown User'}
                        </Box>
                      </TableCell>
                      <TableCell>{test.test || 'Unknown Test'}</TableCell>
                      <TableCell align="right">{test.score}/{test.totalQuestions}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={`${test.percentage}%`}
                          color={test.percentage >= 70 ? 'success' : test.percentage >= 50 ? 'warning' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(test.submittedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box textAlign="center" py={4}>
              <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No recent test submissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent test submissions will appear here.
              </Typography>
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>Admin Management</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Create New Admin</Typography>
              <Paper component="form" onSubmit={handleCreateAdmin} sx={{ p: 2 }}>
                <input className='form-control mb-2' type="email" placeholder="Email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                <input className='form-control mb-2' type="password" placeholder="Password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} required />
                <Button type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />}>Create Admin</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle1" gutterBottom>Registered Admins</Typography>
              {adminLoading ? <CircularProgress /> : adminError ? <Typography color="error">{adminError}</Typography> : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin._id}>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{formatDate(admin.createdAt)}</TableCell>
                          <TableCell align="right">
                            <Button color="error" onClick={() => handleDeleteAdmin(admin)}><DeleteIcon /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>
        </TabPanel>

      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Deactivate User
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to deactivate user <strong>{deleteDialog.user?.name}</strong>? 
            This action will prevent them from logging in, but their data will be preserved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, user: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeactivateUser}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Admin Confirmation Dialog */}
      <Dialog 
        open={deleteAdminDialog.open} 
        onClose={handleCloseDeleteAdminDialog}
        BackdropProps={{ 
          component: 'div',
          style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' } 
        }}
      >
        <DialogTitle>Delete Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the admin account for <strong>{deleteAdminDialog.admin?.email}</strong>? This action cannot be undone.
          </DialogContentText>
{{ ... }}
        <DialogActions>
          <Button onClick={() => setDeleteAdminDialog({ open: false, admin: null })}>Cancel</Button>
          <Button onClick={confirmDeleteAdmin} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Icons are imported from @mui/icons-material

// Add some custom styles
const styles = {
  viewTestsBtn: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
    '&:disabled': {
      backgroundColor: '#e0e0e0',
      color: '#9e9e9e',
      cursor: 'not-allowed',
    },
  },
};

export default Users;
