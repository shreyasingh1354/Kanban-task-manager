import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CalendarMonth,
  Add,
  Dashboard,
  Group,
  ViewKanban,
  Menu as MenuIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { getUserTeams } from '../services/teamService';
import CreateTeamModal from './createTeamModal';

const drawerWidth = 260;

const Sidebar = ({ onViewChange, currentView, open, onToggle, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = currentView || '';
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  // Fetch user teams
  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const userTeams = await getUserTeams();
      setTeams(userTeams);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      setError("Couldn't load your teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleNavigation = (path) => {
    if (onViewChange) {
      onViewChange(path);
    }
    navigate(`/${path}`);
  };

  const handleNavigateToTeamBoard = (teamId) => {
    navigate(`/team/${teamId}/board`);
  };

  const handleCreateTeam = () => {
    setCreateTeamModalOpen(true);
  };

  const handleTeamCreated = (newTeam) => {
    setTeams(prevTeams => [newTeam, ...prevTeams]);
  };

  return (
    <>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          left: open ? drawerWidth - 40 : 20,
          top: 20,
          zIndex: 1300,
          transition: 'left 0.3s',
          bgcolor: 'background.paper',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.3s',
          },
        }}
      >
        {/* User Profile Section */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{user?.username || 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* My Work Section */}
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
            MY WORK
          </Typography>
          <List sx={{ mt: 1 }}>
            <ListItem
              button
              selected={currentPath === 'dashboard'}
              onClick={() => handleNavigation('dashboard')}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.lighter' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Dashboard fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
            <ListItem
              button
              selected={currentPath === 'board'}
              onClick={() => handleNavigation('board')}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'primary.lighter' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <ViewKanban fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="All Tasks" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* Teams Section */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
              TEAMS
            </Typography>
            <Tooltip title="Create a new team">
              <Button
                size="small"
                sx={{ minWidth: 'auto', p: 0.5 }}
                color="primary"
                onClick={handleCreateTeam}
              >
                <Add fontSize="small" />
              </Button>
            </Tooltip>
          </Box>
          
          {/* Teams List */}
          <List>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', p: 1 }}>
                <ErrorIcon fontSize="small" />
                <Typography variant="caption">{error}</Typography>
              </Box>
            ) : teams.length === 0 ? (
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  No teams yet. Create one!
                </Typography>
              </Box>
            ) : (
              teams.map(team => (
                <ListItem
                  key={team.id}
                  button
                  onClick={() => handleNavigateToTeamBoard(team.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Group fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={team.name} 
                    primaryTypographyProps={{ variant: 'body2' }} 
                    secondary={team.role === 'admin' ? 'Admin' : 'Member'}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Box>

        <Divider />
        
        {/* Additional Navigation Items */}
        <Box sx={{ p: 2, mb: 2 }}>
          <List sx={{ mt: 1 }}>
            <ListItem
              button
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CalendarMonth fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Calendar" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Create Team Modal */}
      <CreateTeamModal 
        open={createTeamModalOpen} 
        onClose={() => setCreateTeamModalOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    </>
  );
};

export default Sidebar;