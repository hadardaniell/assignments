import { UserModel, User } from './user.model';
import { UserDTO, UpdateUserDTO } from './users.types';

export const createUserDAL = async (data: UserDTO): Promise<User> => {
  const user = await UserModel.create({
    ...data,
    createdAt: new Date(),
  });
  return user;
};

export const findUserByEmailDAL = async (email: string): Promise<User | null> => {
  return UserModel.findOne({ email }).exec();
};

export const findUserByIdDAL = async (id: string): Promise<User | null> => {
  return UserModel.findById(id).exec();
};

export const findAllUsersDAL = async (): Promise<User[]> => {
  return UserModel.find({}).exec();
};

export const updateUserDAL = async (
  id: string,
  updates: UpdateUserDTO & { updatedAt?: Date }
): Promise<User | null> => {
  return UserModel.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  ).exec();
};

export const deleteUserDAL = async (id: string): Promise<User | null> => {
  return UserModel.findByIdAndDelete(id).exec();
};
