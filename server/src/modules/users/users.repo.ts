import { UserModel, User } from './user.model';
import { UserDTO, UpdateUserDTO } from './users.types';

export class UserRepo {
  constructor() {}

  async createUserDAL(data: UserDTO): Promise<User> {
    const user = await UserModel.create({
      ...data,
      createdAt: new Date(),
    });
    return user;
  };

  async findUserByEmailDAL(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  };

  async findUserByIdDAL(id: string): Promise<User | null> {
    return UserModel.findById(id).exec();
  };

  async findAllUsersDAL(): Promise<User[]> {
    return UserModel.find({}).exec();
  };

  async findUserByEmailWithPasswordDAL(email: string) {
    return UserModel.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");
  }

  async updateUserDAL(
    id: string,
    updates: UpdateUserDTO & { updatedAt?: Date }
  ): Promise<User | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).exec();
  };

  async deleteUserDAL(id: string): Promise<User | null> {
    return UserModel.findByIdAndDelete(id).exec();
  };
}