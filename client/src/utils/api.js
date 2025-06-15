import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signUp = async (userData) => {
  try {
    const response = await API.post('/auth/signup', userData);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const login = (credentials) => API.post('/auth/login', credentials);
export const forgotPassword = (email, newPassword) => API.post('/auth/forgot-password', { email, newPassword });
export const getUserProfile = () => API.get('/auth/profile');
export const updateProfile = (profileData) => API.put('/auth/profile', profileData);
export const deleteAccount = () => API.delete('/auth/account');

export const createJournal = (journalData) => {
  const formData = new FormData();
  formData.append('title', journalData.title);
  formData.append('content', journalData.content);
  if (journalData.image) {
    formData.append('image', journalData.image);
  }
  
  return API.post('/journals', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getJournals = () => API.get('/journals');

export const updateJournal = (id, journalData) => {
  const formData = new FormData();
  formData.append('title', journalData.title);
  formData.append('content', journalData.content);
  
  if (journalData.image) {
    formData.append('image', journalData.image);
  }
  if (typeof journalData.currentImageUrl !== 'undefined') {
    formData.append('currentImageUrl', journalData.currentImageUrl || '');
  }

  return API.put(`/journals/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteJournal = (id) => API.delete(`/journals/${id}`);
export default API;