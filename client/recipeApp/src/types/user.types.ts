import type { UserRole } from "./auth.types";

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


