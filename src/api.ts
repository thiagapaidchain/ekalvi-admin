export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem('ekalvi_admin_token');
  },

  setToken(token: string) {
    localStorage.setItem('ekalvi_admin_token', token);
  },

  clearToken() {
    localStorage.removeItem('ekalvi_admin_token');
  },

  getUser(): User | null {
    const raw = localStorage.getItem('ekalvi_admin_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUser(user: User) {
    localStorage.setItem('ekalvi_admin_user', JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem('ekalvi_admin_user');
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`[Admin API] Failed to fetch ${endpoint}:`, err.message);
      throw err;
    }
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  },
};
