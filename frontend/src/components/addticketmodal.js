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

  // Handle numeric input only for the assignedTo field
  const handleAssignedToChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers only
    if (value === '' || /^[0-9]+$/.test(value)) {
      setAssignedTo(value);
    }
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
      // Convert assignedTo to a proper integer or null if empty
      const userIdInt = assignedTo ? Number(assignedTo) : null;
      
      const taskData = {
        title,
        description,
        listId: Number(listId), // Ensure listId is also a number
        assignedTo: userIdInt, // Pass the integer value
        priority,
        status
      };

      console.log('Sending task data:', taskData); // Debug logging
      
      const newTask = await createTask(taskData);
      console.log('Received task response:', newTask); // Debug logging
      
      // Find the assigned username if a user is assigned
      let assignedUsername = '';
      if (userIdInt !== null) {
        const assignedUser = users.find(user => user.id === userIdInt);
        assignedUsername = assignedUser ? assignedUser.username : `User ${userIdInt}`;
      }
      
      // Convert backend task format to frontend ticket format
      const newTicket = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description || '',
        assigned_to: userIdInt, // This is the integer userId
        assignees: userIdInt !== null ? [assignedUsername] : [],
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
      console.error('Error creating task:', err); // Debug logging
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
          label="Title *"
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
              <MenuItem key={list.id} value={list.id.toString()}>
                {list.title}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            New tasks are always added to the "{listTitle}" list
          </Typography>
        </FormControl>

        {/* Changed from Select to TextField for direct userId input */}
        <TextField
          label="Assign To (User ID)"
          value={assignedTo}
          onChange={handleAssignedToChange}
          placeholder="Enter User ID (leave empty for unassigned)"
          fullWidth
          inputProps={{
            pattern: '[0-9]*', // Accepts only numbers
            inputMode: 'numeric' // Shows numeric keyboard on mobile
          }}
          helperText="Enter a numeric User ID or leave empty for unassigned"
        />

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
          CANCEL
        </Button>
        <Button 
          onClick={handleAdd} 
          variant="contained" 
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Creating...' : 'ADD TASK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTicketModal;