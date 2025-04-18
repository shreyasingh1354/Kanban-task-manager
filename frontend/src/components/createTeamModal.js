import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { createTeam } from '../services/teamService';
import { useNavigate } from 'react-router-dom';

const CreateTeamModal = ({ open, onClose, onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await createTeam(teamName);
      console.log("Create team response:", response);
      setLoading(false);
      
      if (response && response.team) {
        onTeamCreated(response.team);
        onClose();
  
        const teamId = response.team.id || response.team._id;
  
        if (response.boardId && teamId) {
          navigate(`/team/${teamId}/board`);
        } else {
          console.warn("Missing teamId or boardId");
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create team. Please try again.');
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Create a New Team</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              fullWidth
              required
              autoFocus
              placeholder="Enter team name"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            A default board will be created for your team.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            color="inherit"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTeamModal;