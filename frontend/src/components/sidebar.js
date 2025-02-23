import React from 'react';
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
} from '@mui/material';
import {
  CalendarMonth,
  Add,
  Dashboard,
  Group,
  ViewKanban,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const Sidebar = ({ onViewChange, currentView, open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = currentView || '';

  const handleNavigation = (path) => {
    if (onViewChange) {
      onViewChange(path);
    }
    navigate(`/${path}`);
  };

  const teams = [
    { id: 1, name: 'Design Team' },
    { id: 2, name: 'Development Team' },
    { id: 3, name: 'Marketing Team' }
  ];

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
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>JD</Avatar>
            <Box>
              <Typography variant="subtitle2">John Doe</Typography>
              <Typography variant="caption" color="text.secondary">
                john@example.com
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

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
                <Dashboard />
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
                <ViewKanban />
              </ListItemIcon>
              <ListItemText primary="All Tasks" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          </List>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
              TEAMS
            </Typography>
            <Button
              size="small"
              sx={{ minWidth: 'auto', p: 0.5 }}
              color="primary"
            >
              <Add fontSize="small" />
            </Button>
          </Box>
          <List>
            {teams.map(team => (
              <ListItem
                key={team.id}
                button
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Group />
                </ListItemIcon>
                <ListItemText primary={team.name} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />
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
                <CalendarMonth />
              </ListItemIcon>
              <ListItemText primary="Calendar" primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;