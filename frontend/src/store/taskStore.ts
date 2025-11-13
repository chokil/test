import { create } from 'zustand';
import { api } from '../lib/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/tasks');
      set({ tasks: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createTask: async (task) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/tasks', task);
      set({ tasks: [response.data, ...get().tasks], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateTask: async (id, task) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/tasks/${id}`, task);
      set({
        tasks: get().tasks.map((t) => (t.id === id ? response.data : t)),
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set({
        tasks: get().tasks.filter((t) => t.id !== id),
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
