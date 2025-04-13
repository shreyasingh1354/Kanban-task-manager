import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create a new team
export const createTeam = async (name) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/teams/create`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to create team'
    );
  }
};

// Get user's teams
export const getUserTeams = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/teams/user/teams`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.teams;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch teams'
    );
  }
};

// Get team members
export const getTeamMembers = async (teamId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/teams/${teamId}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.members;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch team members'
    );
  }
};

// Add a team member
export const addTeamMember = async (teamId, userId, role = 'member') => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/members`,
      { userId, role },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to add team member'
    );
  }
};

// Remove a team member
export const removeTeamMember = async (teamId, userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `${API_URL}/teams/${teamId}/members/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to remove team member'
    );
  }
};
// Get single team by ID
export const getTeamById = async (teamId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/teams/${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.team;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch team details'
    );
  }
};