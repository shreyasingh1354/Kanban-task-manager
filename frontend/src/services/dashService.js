import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  // Configure axios with auth header
  const authAxios = () => {
    const token = getAuthToken();
    
    // Check if token exists before creating the axios instance
    if (!token) {
      console.error('Auth token is missing!');
    }
    
    return axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
  };

export const getUserDashboardTasks = async () => {
    try {
      const response = await authAxios().get('/allTasks/tasks');
      return response.data.data; // returns { todo: [...], inProgress: [...], completed: [...] }
    } catch (error) {
      console.error('Error fetching user dashboard tasks:', error);
      throw error;
    }
  };