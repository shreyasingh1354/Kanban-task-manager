import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add auth token to all requests
const authAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await authAxios().post('/tasks/create', taskData);
    return response.data.task;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get tasks for a specific list
export const getListTasks = async (listId) => {
  try {
    const response = await authAxios().get(`/tasks/list/${listId}`);
    return response.data.tasks;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await authAxios().put(`/tasks/${taskId}`, taskData);
    return response.data.task;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    const response = await authAxios().delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createTask,
  getListTasks,
  updateTask,
  deleteTask
};