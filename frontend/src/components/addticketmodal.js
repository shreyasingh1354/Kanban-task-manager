import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

function AddTicketModal({ open, onClose, onAddTicket }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');

  
  useEffect(() => {
    if (!open) {
      setTitle('');
      setType('');
      setPriority('');
    }
  }, [open]);

  const handleAdd = () => {
    
    const newTicket = {
      id: Date.now(), 
      title: title || 'Untitled Ticket',
      type: type || 'Design',
      priority: priority || 'Medium',
      dateRange: 'N/A',
      assignees: [],
      subtasks: 0,
      comments: 0,
      status: 'To-Do',
      workflow: 'Standard',
      taskType: 'Feature',
      estimate: 'Unestimated',
      team: 'Team N/A'
    };
    onAddTicket(newTicket);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Ticket</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <TextField
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleAdd} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTicketModal;
