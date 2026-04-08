import axios from 'axios';
import { useUiStore } from '../store/useUiStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status !== 401) {
        // Direct access to Zustand store state/actions
        useUiStore.getState().showToast(message, 'error');
    }
    
    return Promise.reject(error);
  }
);

export default api;
