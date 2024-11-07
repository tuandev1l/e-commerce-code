import { ILogin } from './login.interface';

export interface ISignup extends ILogin {
  name: string;
  phone: string;
  birthday: string;
  gender: string;
  avatar?: string;
  address: {
    country: string;
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
  };
  confirmPassword: string;
}

export const signupDefault = {
  email: '',
  password: '',
  name: '',
  phone: '',
  birthday: '',
  gender: '',
  avatar:
    'https://w7.pngwing.com/pngs/867/694/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-logo-thumbnail.png',
  address: {
    country: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
  },
  confirmPassword: '',
};
