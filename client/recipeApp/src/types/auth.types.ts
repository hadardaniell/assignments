export type RegisterDTO = {
  email: string;
  password: string;
  name: string;
  avatarUrl?: string | null;
  language?: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  settings?: Record<string, any>;
  role: UserRole;
  createdAt: Date;
  updatedAt?: Date;
}

export type UserRole = 'admin' | 'user';
