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
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { getTeamMembers, removeTeamMember, getTeamById } from '../services/teamService';
import { getTeamBoards } from '../services/boardService';
import Board from './board';
import AddMemberModal from '../components/AddMemberModal';

const TeamBoard = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [teamName, setTeamName] = useState("Team Board"); // Default team name

  // Load current user ID once on component mount
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setCurrentUserId(userData.id);
        console.log("Retrieved user ID:", userData.id);
      } else {
        console.log("No user data found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  // Fetch team data and boards
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) return;

      setLoading(true);
      try {
        // Fetch team details to get the name
        const teamDetails = await getTeamById(teamId);
        if (teamDetails && teamDetails.name) {
          setTeamName(teamDetails.name);
          console.log("Team name fetched:", teamDetails.name);
        }

        // Fetch team members
        const members = await getTeamMembers(teamId);
        setTeamMembers(members);
        console.log("Team members:", members);

        // Check if current user is admin using the stored currentUserId
        if (currentUserId) {
          console.log("Checking if user", currentUserId, "is admin");
          const currentUser = members.find(member => member.id === currentUserId);
          console.log("Found user in members:", currentUser);

          if (currentUser && currentUser.role === 'admin') {
            console.log("User is admin!");
            setIsAdmin(true);
          } else {
            console.log("User is not admin or not found in members");
            setIsAdmin(false);
          }
        }

        // Fetch boards for this team
        const boardsData = await getTeamBoards(teamId);
        setBoards(boardsData);

        // Set current board to the first one if available
        if (boardsData && boardsData.length > 0) {
          setCurrentBoard(boardsData[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message || "Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch team data if currentUserId is available
    if (currentUserId) {
      fetchTeamData();
    }
  }, [teamId, currentUserId]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleMemberAdded = async () => {
    try {
      const members = await getTeamMembers(teamId);
      setTeamMembers(members);
      setShowAddMember(false);
    } catch (err) {
      console.error("Error refreshing team members:", err);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await removeTeamMember(teamId, userId);
      const members = await getTeamMembers(teamId);
      setTeamMembers(members);
      setRemoveConfirm(null);
    } catch (err) {
      console.error("Error removing team member:", err);
      setError(err.message || "Failed to remove team member");
    }
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

            {isAdmin && (
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setShowAddMember(true)}
              >
                Add Member
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {currentBoard ? (
          <Board boardId={currentBoard.id} teamId={teamId} />
        ) : (
          <Alert severity="info">
            No boards found for this team. Create a board to get started.
          </Alert>
        )}

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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={member.role === 'admin' ? 'Admin' : 'Member'} 
                      color={member.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />

                    {isAdmin && member.id !== currentUserId && (
                      <Button 
                        size="small" 
                        color="error" 
                        startIcon={<DeleteIcon />}
                        onClick={() => setRemoveConfirm(member)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                </Paper>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            {isAdmin && (
              <Button 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={() => {
                  setShowMembers(false);
                  setShowAddMember(true);
                }}
              >
                Add Member
              </Button>
            )}
            <Button onClick={() => setShowMembers(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Add Member Modal */}
        <AddMemberModal 
          open={showAddMember}
          onClose={() => setShowAddMember(false)}
          teamId={teamId}
          onMemberAdded={handleMemberAdded}
        />

        {/* Confirm Delete Dialog */}
        <Dialog
          open={Boolean(removeConfirm)}
          onClose={() => setRemoveConfirm(null)}
        >
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {removeConfirm?.username} from the team?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRemoveConfirm(null)}>Cancel</Button>
            <Button 
              color="error" 
              onClick={() => handleRemoveMember(removeConfirm?.id)}
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TeamBoard;