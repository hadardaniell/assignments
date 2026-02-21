import { UserDTO, UpdateUserDTO, SafeUser } from './users.types';
import { AppError } from '../../common';
import { UserRepo } from './users.repo';
import mongoose from 'mongoose';
import fs from "fs";
import path from "path";

export class UserService {
  private readonly userRepo: UserRepo = new UserRepo();

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
    updates: Partial<UpdateUserDTO> | { avatarUrl?: string }
  ): Promise<SafeUser> {
    const updated = await this.userRepo.updateUserDAL(id, {
      ...updates,
      updatedAt: new Date(),
    });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Invalid user ID', 'INVALID_ID');
    }

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

  async getUserByEmailService(email: string): Promise<SafeUser | null> {
    const user = await this.userRepo.findUserByEmailDAL(email);
    return user ? this.toSafeUser(user) : null;
  }

  async getUserByEmailWithPasswordService(email: string): Promise<any | null> {
    return this.userRepo.findUserByEmailWithPasswordDAL(email);
  }

  async uploadUserAvatar(id: string, file: Express.Multer.File): Promise<string> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid user ID", "INVALID_ID");
    }
    if (!file) {
      throw new AppError(400, "File is required");
    }

    const targetDir = path.join(process.cwd(), "uploads", "profile_images");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || "";
    const fileName = `${id}${ext}`;
    const targetPath = path.join(targetDir, fileName);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    if ((file as any).path && fs.existsSync((file as any).path)) {
      fs.copyFileSync((file as any).path, targetPath);
      fs.unlinkSync((file as any).path);
    }
    else if ((file as any).buffer && (file as any).buffer.length > 0) {
      fs.writeFileSync(targetPath, (file as any).buffer);
    } else {
      console.log("Multer file keys:", Object.keys(file));
      throw new AppError(500, "Temporary file error");
    }

    const avatarUrl = `/uploads/profile_images/${fileName}`;

    const updated = await this.userRepo.updateUserDAL(id, {
      avatarUrl,
      updatedAt: new Date(),
    });

    if (!updated) {
      try { fs.unlinkSync(targetPath); } catch { }
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }

    return avatarUrl;
  }
}