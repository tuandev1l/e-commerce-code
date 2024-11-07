import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestLoginApi } from '../../api/api';
import { AuthBox } from '../../common/auth/AuthBox';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { ILogin } from '../../interfaces/login.interface';
import { useAppDispatch } from '../../store/store';
import { loginSuccess } from './authSlice';

type Props = {};

export const Login = ({}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<ILogin>({
    email: '',
    password: '',
  });

  const { mutate } = useMutation({
    mutationKey: ['auth/login'],
    mutationFn: requestLoginApi,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
      toast({ type: 'success', message: 'Login successfully' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: (error: IAxiosError) => {
      console.log(error);
      toast({ type: 'error', message: error.message });
    },
  });

  const submitHandling = async () => {
    console.log(formData);

    if (formData.email !== '' && formData.password !== '') {
      mutate(formData);
    }
  };

  return (
    <Layout>
      <AuthBox>
        <div className='w-7/12 bg-white'>
          <div className='w-full bg-white md:mt-0 xl:p-0 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl '>
                Login to your account
              </h1>
              <div className='space-y-4 md:space-y-6'>
                <div className='flex flex-col w-full'>
                  <label
                    htmlFor='email_or_phone'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Your email
                  </label>
                  <input
                    type='text'
                    name='email_or_phone'
                    id='email_or_phone'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                    placeholder='name@company.com'
                    required={true}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:border-blue-500'
                    required={true}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <Link to={'/auth/forgot-password'}>
                  <div className='text-md font-medium text-primary-600 hover:underline dark:text-primary-500 hover:cursor-pointer'>
                    Forgot password?
                  </div>
                </Link>
                <Link to='/auth/signup'>
                  <p className='text-md font-light text-black'>
                    Don't have an account yet?{' '}
                    <span className='font-medium text-primary-600 hover:underline dark:text-primary-700 underline'>
                      Sign up
                    </span>
                  </p>
                </Link>
              </div>
              <button
                type='submit'
                onClick={submitHandling}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </AuthBox>
    </Layout>
  );
};
