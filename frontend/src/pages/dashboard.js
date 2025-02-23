import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Group as GroupIcon,
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  NotificationsActive as ActivityIcon,
  Warning as AlertIcon,
} from '@mui/icons-material';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const stats = [
    { title: 'Total Tasks', value: '24', icon: BarChartIcon, change: '+12%', changeType: 'increase' },
    { title: 'Team Members', value: '12', icon: GroupIcon, change: '+2', changeType: 'increase' },
    { title: 'In Progress', value: '8', icon: ClockIcon, change: '-3', changeType: 'decrease' },
    { title: 'Completed', value: '156', icon: CheckCircleIcon, change: '+8%', changeType: 'increase' },
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'completed', task: 'Homepage Redesign', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop' },
    { user: 'Alice Mitchell', action: 'commented on', task: 'User Authentication Flow', time: '4h ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop' },
    { user: 'Robert Wilson', action: 'started', task: 'API Integration', time: '6h ago', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop' },
  ];

  const upcomingDeadlines = [
    { task: 'Mobile App Design', deadline: 'Tomorrow', priority: 'High', team: 'Design' },
    { task: 'Database Migration', deadline: 'In 2 days', priority: 'Medium', team: 'Development' },
    { task: 'Q4 Marketing Plan', deadline: 'In 3 days', priority: 'High', team: 'Marketing' },
  ];

  return (
    <Box sx={{ display: 'left', height: '100vh', overflow: 'hidden' }}>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle}/>

<Box 
  component="main" 
  sx={{ 
    flexGrow: 1, 
    p: 2, 
    ml: sidebarOpen ? '260px' : 0,
    width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
    transition: 'margin-left 0.3s, width 0.3s',
    overflowY: 'auto' 
  }}
>
  <Header title="Dashboard" />

  {/* Stats Grid */}
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {stats.map((stat, index) => (
      <Grid item xs={12} md={6} lg={3} key={index}>
        <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{stat.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color: stat.changeType === 'increase' ? 'success.main' : 'error.main' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{stat.change}</Typography>
              {stat.changeType === 'increase' ? <TrendingUpIcon sx={{ ml: 0.5 }} /> : <TrendingDownIcon sx={{ ml: 0.5 }} />}
            </Box>
          </Box>
          <Typography variant="h4" sx={{ mt: 1 }}>{stat.value}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>

  <Grid container spacing={3}>
    {/* Recent Activity */}
    <Grid item xs={12} lg={6}>
      <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Recent Activity</Typography>
          <IconButton size="small"><ActivityIcon /></IconButton>
        </Box>
        <List>
          {recentActivity.map((activity, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar src={activity.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2">
                    <Typography component="span" sx={{ fontWeight: 600 }}>{activity.user}</Typography>{' '}
                    {activity.action}{' '}
                    <Typography component="span" sx={{ fontWeight: 600 }}>{activity.task}</Typography>
                  </Typography>
                }
                secondary={activity.time}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>

    {/* Upcoming Deadlines */}
    <Grid item xs={12} lg={6}>
      <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Upcoming Deadlines</Typography>
          <IconButton size="small"><AlertIcon /></IconButton>
        </Box>
        <List>
          {upcomingDeadlines.map((deadline, index) => (
            <ListItem
              key={index}
              sx={{
                bgcolor: 'grey.50',
                borderRadius: 1,
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant="subtitle2">{deadline.task}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">{deadline.team}</Typography>
                  <Typography variant="body2" color="text.secondary">•</Typography>
                  <Typography variant="body2" color="text.secondary">{deadline.deadline}</Typography>
                </Box>
              </Box>
              <Chip
                label={deadline.priority}
                size="small"
                color={deadline.priority === 'High' ? 'error' : 'warning'}
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Grid>
  </Grid>
</Box>
</Box>
);
};

export default Dashboard;