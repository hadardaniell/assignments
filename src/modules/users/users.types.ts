export interface UserDTO {
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string | null;
  settings?: Record<string, any>;
}

export type UpdateUserDTO = Partial<UserDTO>;

export interface SafeUser {
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