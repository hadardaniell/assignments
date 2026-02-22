import { SafeUser } from "../users/users.types";

export type RegisterDTO = {
  email: string;
  password?: string; 
  name: string;
  avatarUrl?: string | null;
  language?: string;
  googleId?: string;
};

export type LoginDTO = {
  email: string;
  password?: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: SafeUser;
};