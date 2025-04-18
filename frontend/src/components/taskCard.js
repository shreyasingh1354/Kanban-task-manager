import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Close,
  Schedule,
  Flag,
  Assignment,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { updateTask } from '../services/taskService';

const TaskCard = ({ open, onClose, task, lists = [], users = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setEditedTask({...task});
    }
  }, [task]);

  if (!task || !editedTask) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Format data for backend
      const taskData = {
        title: editedTask.title,
        description: editedTask.description || '',
        listId: editedTask.list_id,
        priority: editedTask.priority.toLowerCase(),
        status: editedTask.status.toLowerCase(),
        assignedTo: editedTask.assigned_to // Fixed: Use assigned_to instead of assignTo
      };

      // Call API to update task
      const updatedTask = await updateTask(task.id, taskData);
      
      // Format for frontend display
      const updatedTicket = {
        ...task,
        ...updatedTask,
        title: updatedTask.title,
        description: updatedTask.description || '',
        list_id: updatedTask.list_id,
        priority: updatedTask.priority,
        status: updatedTask.status,
        assigned_to: updatedTask.assigned_to, // Added this field
        assignees: updatedTask.assigned_to ? 
          [updatedTask.assigned_username || `User ${updatedTask.assigned_to}`] : []
      };
      
      setIsEditing(false);
      onClose(updatedTicket);
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTask({...task});
    setIsEditing(false);
    setError(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card sx={{ 
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'auto',
        m: 2
      }}>
        <IconButton 
          onClick={() => onClose()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1
          }}
        >
          <Close />
        </IconButton>

        {!isEditing ? (
          // View Mode
          <CardContent sx={{ pt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Task ID: {task.id}
              </Typography>
              <IconButton onClick={handleEdit} size="small" sx={{ mr: 4 }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip 
                icon={<Schedule sx={{ fontSize: 18 }} />}
                label={task.status}
                size="small"
                color="info"
              />
              <Chip 
                icon={<Flag sx={{ fontSize: 18 }} />}
                label={`${task.priority} Priority`}
                size="small"
                color={task.priority.toLowerCase() === 'high' ? 'error' : 
                  task.priority.toLowerCase() === 'medium' ? 'warning' : 'success'}
              />
            </Stack>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {task.description}
              </Typography>
            )}

            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment fontSize="small" color="action" />
                <Typography variant="body2">
                  Workflow: {task.workflow || 'Standard'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assignment fontSize="small" color="action" />
                <Typography variant="body2">
                  Type: {task.taskType || 'Feature'}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Assignees Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Assignees
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.map((assignee, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
                        {assignee.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{assignee}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Unassigned
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Date Range */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Date Range
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.dateRange || 'Not specified'}
              </Typography>
            </Box>

            {/* Statistics */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Statistics
              </Typography>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Subtasks
                  </Typography>
                  <Typography variant="body1">
                    {task.subtasks || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Comments
                  </Typography>
                  <Typography variant="body1">
                    {task.comments || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Bottom Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 'auto'
            }}>
              <Typography variant="body2" color="text.secondary">
                Estimate: {task.estimate || 'Unestimated'}
              </Typography>
              <Chip 
                label={task.team || 'No Team'} 
                size="small" 
                variant="outlined"
              />
            </Box>
          </CardContent>
        ) : (
          // Edit Mode
          <CardContent sx={{ pt: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Task ID: {task.id}
            </Typography>
            
            <TextField
              label="Title"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Description"
              name="description"
              value={editedTask.description || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editedTask.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={editedTask.priority}
                  label="Priority"
                  onChange={handleChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {lists.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>List</InputLabel>
                <Select
                  name="list_id"
                  value={editedTask.list_id}
                  label="List"
                  onChange={handleChange}
                >
                  {lists.map(list => (
                    <MenuItem key={list.id} value={list.id}>
                      {list.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {users.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Assign To</InputLabel>
                <Select
                  name="assigned_to" // Fixed: changed from assignTo to assigned_to
                  value={editedTask.assigned_to || ''}
                  label="Assign To"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Unassigned</em>
                  </MenuItem>
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        )}
      </Card>
    </Modal>
  );
};

export default TaskCard;