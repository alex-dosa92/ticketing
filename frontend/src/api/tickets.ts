import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api';

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Ticket {
  _id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdBy: User | string;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  ticketId: string;
  userId: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketData {
  title: string;
  description?: string;
  status?: 'Open' | 'In Progress' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  status?: 'Open' | 'In Progress' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface GetTicketsParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export const getTickets = async (params?: GetTicketsParams): Promise<Ticket[]> => {
  const res = await axios.get(`${BASE_URL}/tickets`, {
    headers: createAuthHeaders(),
    params,
  });
  return res.data;
};

export const getTicket = async (id: string): Promise<Ticket> => {
  const res = await axios.get(`${BASE_URL}/tickets/${id}`, {
    headers: createAuthHeaders(),
  });
  return res.data;
};

export const createTicket = async (ticketData: CreateTicketData): Promise<Ticket> => {
  const res = await axios.post(`${BASE_URL}/tickets`, ticketData, {
    headers: createAuthHeaders(),
  });
  return res.data;
};

export const updateTicket = async (id: string, ticketData: UpdateTicketData): Promise<Ticket> => {
  const res = await axios.put(`${BASE_URL}/tickets/${id}`, ticketData, {
    headers: createAuthHeaders(),
  });
  return res.data;
};

export const deleteTicket = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/tickets/${id}`, {
    headers: createAuthHeaders(),
  });
};

// Comment API functions
export const getComments = async (ticketId: string): Promise<Comment[]> => {
  const res = await axios.get(`${BASE_URL}/tickets/${ticketId}/comments`, {
    headers: createAuthHeaders(),
  });
  return res.data;
};

export const createComment = async (ticketId: string, content: string): Promise<Comment> => {
  const res = await axios.post(`${BASE_URL}/tickets/${ticketId}/comments`, { content }, {
    headers: createAuthHeaders(),
  });
  return res.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/comments/${commentId}`, {
    headers: createAuthHeaders(),
  });
};
