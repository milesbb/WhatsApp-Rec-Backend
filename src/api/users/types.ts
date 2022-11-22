import { Model, Document } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
  avatar: string;
  refreshToken: string;
}

export interface UserDocument extends User, Document {}

export interface UsersModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    plainPassword: string
  ): Promise<UserDocument | null>;
}
