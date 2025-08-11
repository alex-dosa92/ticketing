import axios from 'axios';

const BASE_URL = 'http://localhost:5050/api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return {
    token: res.data.token,
    user: {
      id: res.data.user._id,
      name: res.data.user.name,
      email: res.data.user.email,
    },
  };
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
  return {
    token: res.data.token,
    user: {
      id: res.data.user._id,
      name: res.data.user.name,
      email: res.data.user.email,
    },
  };
};
