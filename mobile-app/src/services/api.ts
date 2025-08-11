import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, Comment } from '../types';

const API_BASE_URL = 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const ticketAPI = {
  getTickets: async (params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },
  
  getTicket: async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  createTicket: async (data: Partial<Ticket>) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },
  
  updateTicket: async (id: string, data: Partial<Ticket>) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },
  
  deleteTicket: async (id: string) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
};

export const commentAPI = {
  getComments: async (ticketId: string) => {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },
  
  createComment: async (ticketId: string, content: string) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, { content });
    return response.data;
  },
  
  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export default api;