import { UserDTO, UpdateUserDTO, SafeUser } from './users.types'; // או ../types/users.types לפי המבנה שלך
import {
  createUserDAL,
  findAllUsersDAL,
  findUserByEmailDAL,
  findUserByIdDAL,
  updateUserDAL,
  deleteUserDAL,
} from './users.dal';
import { AppError } from '../../common';

const toSafeUser = (user: any): SafeUser => {
  const obj = user.toObject ? user.toObject() : user;
  const { passwordHash, __v, ...clean } = obj;
  return clean as SafeUser;
};

export const createUserService = async (input: UserDTO): Promise<SafeUser> => {
  const existing = await findUserByEmailDAL(input.email);
  if (existing) {
    throw new AppError(409, 'User with this email already exists', 'EMAIL_TAKEN');
  }

  const user = await createUserDAL(input);
  return toSafeUser(user);
};

export const getAllUsersService = async (): Promise<SafeUser[]> => {
  const users = await findAllUsersDAL();
  return users.map(toSafeUser);
};

export const getUserByIdService = async (id: string): Promise<SafeUser> => {
  const user = await findUserByIdDAL(id);
  if (!user) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }
  return toSafeUser(user);
};

export const updateUserService = async (
  id: string,
  updates: UpdateUserDTO
): Promise<SafeUser> => {
  const updated = await updateUserDAL(id, {
    ...updates,
    updatedAt: new Date(),
  });

  if (!updated) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }

  return toSafeUser(updated);
};

export const deleteUserService = async (id: string): Promise<void> => {
  const deleted = await deleteUserDAL(id);
  if (!deleted) {
    throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  }
};
