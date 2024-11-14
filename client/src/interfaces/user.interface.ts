import { IUserAddress } from './userAddress.interface';

export interface IUser {
  name: string;
  birthday?: Date;
  email?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  address: IUserAddress[];
  joinedTime: string;
  totalReview: number;
  totalThank: number;
  createdAt: Date;
  updatedAt: Date;
}
