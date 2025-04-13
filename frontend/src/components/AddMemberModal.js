import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { addTeamMember } from '../services/teamService';

const AddMemberModal = ({ open, onClose, teamId, onMemberAdded }) => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      setLoading(true);
      await addTeamMember(teamId, userId, role);
      setSuccess(true);
      setUserId('');
      
      // Notify parent component
      if (onMemberAdded) {
        onMemberAdded();
      }
      
      // Close after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add team member');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserId('');
    setRole('member');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add Team Member</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>Member added successfully!</Alert>}
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Enter user ID to add to the team
            </Typography>
            <TextField
              label="User ID"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              required
              margin="dense"
              helperText="Enter the ID of the user you want to add"
            />
          </Box>
          
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Select Role
            </Typography>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
              name="role-radio-group"
            >
              <FormControlLabel 
                value="member" 
                control={<Radio />} 
                label="Member" 
                disabled={loading}
              />
              <FormControlLabel 
                value="admin" 
                control={<Radio />} 
                label="Admin" 
                disabled={loading}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Member'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMemberModal;