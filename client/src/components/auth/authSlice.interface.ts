import { IUserAddress } from '../../interfaces/userAddress.interface';
import { Role } from './../../enum/role.user.enum';

export interface IAuthSlice {
  isLoading: boolean;
  error?: string;
  isLogin: boolean;
  accessToken?: string;
  user: {
    id?: number;
    name?: string;
    birthday?: string;
    accountType?: string;
    gender?: string;
    isVerifyEmail?: string;
    isVerifyPhone?: string;
    email?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    address?: IUserAddress[];
    shopId: string;
    role: Role;
  };
}

const accessToken = localStorage.getItem('accessToken') || '';
// @ts-ignore
const user = JSON.parse(localStorage.getItem('user')) || {
  id: 0,
  name: '',
  birthday: '',
  accountType: '',
  gender: '',
  isVerifyEmail: '',
  isVerifyPhone: '',
  email: '',
  avatarUrl: '',
  shopId: '',
  role: Role.USER,
};

export const authSliceInitialState: IAuthSlice = {
  isLoading: false,
  error: '',
  isLogin: !!accessToken,
  accessToken,
  user,
};
