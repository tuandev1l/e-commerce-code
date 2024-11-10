import { Gender } from '../enum/userGender.enum';
import { ILogin } from './login.interface';

export interface ISignup extends ILogin {
  name: string;
  birthday: string;
  gender: string;
  avatar?: string;
  confirmPassword: string;
}

export const signupDefault = {
  email: '',
  password: '',
  name: '',
  birthday: '',
  gender: Gender.MALE,
  avatar:
    'https://w7.pngwing.com/pngs/867/694/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-logo-thumbnail.png',
  confirmPassword: '',
};
