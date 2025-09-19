import axios from 'axios';
import { SynchronizationTask, CreateTaskData, UpdateTaskData, ApiResponse } from '../types/SynchronizationTask';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const synchronizationTaskService = {
  async getAll(): Promise<SynchronizationTask[]> {
    const response = await api.get<ApiResponse<SynchronizationTask[]>>('/synchronization-tasks');
    return response.data.data || [];
  },

  async getById(id: number): Promise<SynchronizationTask> {
    const response = await api.get<ApiResponse<SynchronizationTask>>(`/synchronization-tasks/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },

  async create(taskData: CreateTaskData): Promise<SynchronizationTask> {
    const response = await api.post<ApiResponse<SynchronizationTask>>('/synchronization-tasks', taskData);
    if (!response.data.data) {
      throw new Error('Failed to create task');
    }
    return response.data.data;
  },

  async update(id: number, taskData: UpdateTaskData): Promise<SynchronizationTask> {
    const response = await api.put<ApiResponse<SynchronizationTask>>(`/synchronization-tasks/${id}`, taskData);
    if (!response.data.data) {
      throw new Error('Failed to update task');
    }
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/synchronization-tasks/${id}`);
  },

  async toggleEnabled(id: number): Promise<SynchronizationTask> {
    const response = await api.patch<ApiResponse<SynchronizationTask>>(`/synchronization-tasks/${id}/toggle`);
    if (!response.data.data) {
      throw new Error('Failed to toggle task');
    }
    return response.data.data;
  },
};

export default api;
