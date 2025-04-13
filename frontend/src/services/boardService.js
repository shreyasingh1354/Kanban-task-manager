// src/services/boardService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get the auth token from localStorage
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

// Get boards for a team
export const getTeamBoards = async (teamId) => {
  try {
    // Ensure teamId is properly encoded for URL
    const encodedTeamId = encodeURIComponent(teamId);
    
    // Debug logging
    console.log('Fetching boards with token:', getAuthToken());
    
    const response = await authAxios().get(`/boards/team/${encodedTeamId}`);
    return response.data.boards;
  } catch (error) {
    console.error('Error fetching team boards:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
};

// Modified getBoardLists function to display lists in predefined order
export const getBoardLists = async (boardId) => {
  try {
    const response = await authAxios().get(`/lists/board/${boardId}`);
    
    // Define the correct order of lists
    const listOrder = ["To Do", "In Progress", "Completed"];
    
    // Sort the lists based on the predefined order
    return response.data.lists.sort((a, b) => {
      const indexA = listOrder.indexOf(a.title);
      const indexB = listOrder.indexOf(b.title);
      
      // If both lists are in our predefined order, sort by that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only a is in the order, it comes first
      if (indexA !== -1) return -1;
      
      // If only b is in the order, it comes first
      if (indexB !== -1) return 1;
      
      // If neither is in our predefined order, maintain original order
      return 0;
    });
  } catch (error) {
    console.error('Error fetching board lists:', error);
    throw error;
  }
};

export const createBoard = async (title, teamId) => {
  try {
    const response = await authAxios().post('/boards/create', {
      title,
      teamId
    });
    return response.data.board;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

export const createList = async (title, boardId, position) => {
  try {
    const response = await authAxios().post('/lists/create', {
      title,
      boardId,
      position
    });
    return response.data.list;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

export const getListTasks = async (listId) => {
  try {
    const response = await authAxios().get(`/tasks/list/${listId}`);
    return response.data.tasks;
  } catch (error) {
    console.error('Error fetching list tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await authAxios().post('/tasks/create', taskData);
    return response.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await authAxios().put(`/tasks/${taskId}`, taskData);
    return response.data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const getTaskComments = async (taskId) => {
  try {
    const response = await authAxios().get(`/comments/task/${taskId}`);
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching task comments:', error);
    throw error;
  }
};

export const addTaskComment = async (taskId, content) => {
  try {
    const response = await authAxios().post('/comments/create', {
      taskId,
      content
    });
    return response.data.comment;
  } catch (error) {
    console.error('Error adding task comment:', error);
    throw error;
  }
};