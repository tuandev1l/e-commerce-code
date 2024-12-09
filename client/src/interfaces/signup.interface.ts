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
  avatar: 'https://avatar.iran.liara.run/public/boy?username=',
  confirmPassword: '',
};
