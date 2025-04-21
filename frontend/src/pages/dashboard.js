import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  InputBase,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as BoardIcon,
  ViewList as ListIcon,
  FilterList as FilterIcon,
  Settings as CustomizeIcon
} from '@mui/icons-material';

import Sidebar from '../components/sidebar';
import Header from '../components/header';
import AddTicketModal from '../components/addticketmodal';
import { getUserDashboardTasks } from '../services/dashService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [selectedList, setSelectedList] = useState('todo');
  const [view, setView] = useState('board');

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => ({
      ...prev,
      [selectedList]: [...prev[selectedList], newTask]
    }));
    setAddTaskOpen(false);
  };

  const fetchTasks = async () => {
    try {
      const taskData = await getUserDashboardTasks();
      setTasks(taskData);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const COLORS = ['#e53935', '#fdd835', '#43a047'];

  const pieData = [
    { name: 'To Do', value: tasks.todo.length },
    { name: 'In Progress', value: tasks.inProgress.length },
    { name: 'Completed', value: tasks.completed.length },
  ];

  const renderColumn = (title, listName, taskList) => (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'left', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
          <Box>
            <IconButton size="small" onClick={() => { setSelectedList(listName); setAddTaskOpen(true); }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        {taskList.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No tasks</Typography>
        ) : (
          taskList.map((task, i) => (
            <Paper key={i} sx={{ p: 1.5, mb: 1 }} elevation={3}>
              <Typography variant="subtitle2">{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">{task.description}</Typography>
            </Paper>
          ))
        )}
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ display: 'left', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? '260px' : 0,
          width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
          transition: 'margin-left 0.3s, width 0.3s',
          overflowY: 'auto',
          p: 2
        }}
      >
        <Header title="Dashboard" />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {renderColumn('To Do', 'todo', tasks.todo)}
              {renderColumn('In Progress', 'inProgress', tasks.inProgress)}
              {renderColumn('Completed', 'completed', tasks.completed)}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <Paper elevation={6} sx={{ width: 400, p: 3, bgcolor: 'background.paper' }}>
                <Typography variant="h6" align="center" gutterBottom>
                  Task Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </>
        )}
      </Box>
      <AddTicketModal
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onAdd={handleAddTask}
      />
    </Box>
  );
};

export default Dashboard;
