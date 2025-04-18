import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { createTask } from '../services/taskService';
import { getToDoList } from '../components/defaultLists';

function AddTicketModal({ open, onClose, onAddTicket, defaultListId, lists = [], users = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens/closes and set listId to "To Do" list
  useEffect(() => {
    if (open) {
      // Try to find the "To Do" list
      const toDoList = getToDoList(lists);
      // If "To Do" list exists, use it. Otherwise, use defaultListId or first list
      const initialListId = toDoList ? toDoList.id : 
                           (defaultListId || (lists.length > 0 ? lists[0].id : ''));
      
      setListId(initialListId);
    } else {
      resetForm();
    }
  }, [open, defaultListId, lists]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setListId('');
    setAssignedTo('');
    setPriority('medium');
    setStatus('new');
    setError(null);
  };

  const handleAdd = async () => {
    if (!title) {
      setError('Title is required');
      return;
    }

    if (!listId) {
      setError('List is required');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        listId,
        assignedTo: assignedTo || null,
        priority,
        status
      };

      const newTask = await createTask(taskData);
      
      // Convert backend task format to frontend ticket format
      const newTicket = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || '',
        assignees: newTask.assigned_to ? [newTask.assigned_username || `User ${newTask.assigned_to}`] : [],
        priority: newTask.priority,
        status: newTask.status,
        list_id: newTask.list_id,
        subtasks: 0,
        comments: 0,
        dateRange: 'N/A',
        workflow: 'Standard',
        taskType: 'Feature',
        estimate: 'Unestimated',
        team: 'Default Team'
      };

      onAddTicket(newTicket);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  // Find the "To Do" list for the disabled select field
  const toDoList = getToDoList(lists);
  const listTitle = toDoList ? toDoList.title : "To Do";
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>List</InputLabel>
          <Select
            value={listId}
            label="List"
            onChange={(e) => setListId(e.target.value)}
            required
            disabled={true} // Always disable the list selection to enforce "To Do" list
          >
            {lists.map((list) => (
              <MenuItem key={list.id} value={list.id}>
                {list.title}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            New tasks are always added to the "{listTitle}" list
          </Typography>
        </FormControl>

        {users.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Assign To</InputLabel>
            <Select
              value={assignedTo}
              label="Assign To"
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <MenuItem value="">
                <em>Unassigned</em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Creating...' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTicketModal;