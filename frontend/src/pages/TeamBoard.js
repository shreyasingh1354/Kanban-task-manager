import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Group as GroupIcon,
  ArrowBack,
  Add as AddIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { getTeamMembers } from '../services/teamService';
import Board from './board'; // Assuming you have a Board component

const TeamBoard = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const members = await getTeamMembers(teamId);
        setTeamMembers(members);
        setError(null);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message || "Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleBackToDashboard}
            sx={{ mt: 2 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Get team name from first member
  // Note: This assumes the backend is returning team name in the members query
  // If not, you'll need to make a separate API call to get team details
  const teamName = teamMembers.length > 0 && teamMembers[0].team_name ? 
    teamMembers[0].team_name : 
    "Team Board";

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link 
            color="inherit" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            Dashboard
          </Link>
          <Typography color="text.primary">{teamName}</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GroupIcon fontSize="large" color="primary" />
            <Typography variant="h5" component="h1">
              {teamName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<PersonAddIcon />}
              onClick={() => setShowMembers(true)}
            >
              Team Members ({teamMembers.length})
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Board Component */}
        <Board teamId={teamId} />

        {/* Team Members Dialog */}
        <Dialog 
          open={showMembers} 
          onClose={() => setShowMembers(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Team Members</Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              {teamMembers.map((member) => (
                <Paper 
                  key={member.id}
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle1">{member.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                  <Chip 
                    label={member.role === 'admin' ? 'Admin' : 'Member'} 
                    color={member.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </Paper>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowMembers(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TeamBoard;