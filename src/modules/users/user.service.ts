import { UserDTO, UpdateUserDTO, SafeUser } from './users.types'; 
import { AppError } from '../../common';
import { UserRepo } from './users.repo';

export class UserService {
  constructor(private userRepo: UserRepo) {}

  private toSafeUser(user: any): SafeUser {
    const obj = user.toObject ? user.toObject() : user;
    const { passwordHash, __v, ...clean } = obj;
    return clean as SafeUser;
  };
async createUserService(input: UserDTO): Promise<SafeUser> {
  const existing = await this.userRepo.findUserByEmailDAL(input.email);
  if (existing) {
    throw new AppError(409, 'User with this email already exists', 'EMAIL_TAKEN');
  }

  const user = await this.userRepo.createUserDAL(input);
  return this.toSafeUser(user);
};

async getAllUsersService(): Promise<SafeUser[]> {
  const users = await this.userRepo.findAllUsersDAL();
  return users.map(user => this.toSafeUser(user));
};

async getUserByIdService(id: string): Promise<SafeUser> {
  const user = await this.userRepo.findUserByIdDAL(id);
  if (!user) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }
  return this.toSafeUser(user);
};

async updateUserService(
  id: string,
  updates: UpdateUserDTO
): Promise<SafeUser>{
  const updated = await this.userRepo.updateUserDAL(id, {
    ...updates,
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }

  return this.toSafeUser(updated);
};

async deleteUserService(id: string): Promise<void> {
  const deleted = await this.userRepo.deleteUserDAL(id);
  if (!deleted) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }
};
}


