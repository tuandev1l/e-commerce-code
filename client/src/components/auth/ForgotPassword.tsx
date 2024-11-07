import { useState } from 'react';
import { Layout } from '../../common/layout/Layout';
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '../../api/api';
import useToast from '../../hook/useToast';
import { IAxiosError } from '../../config/axiosError.interface';
import { useNavigate } from 'react-router-dom';

type Props = {};

export const ForgotPassword = ({}: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');

  const { mutate } = useMutation({
    mutationKey: [`forgot-password/${email}`],
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast({
        type: 'success',
        message: 'Reset password link was sent to your email',
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const forgotPasswordHandler = () => {
    if (!email) {
      toast({ type: 'error', message: 'Email must not be empty' });
      return;
    }
    mutate(email);
  };

  return (
    <Layout>
      <div className='w-1/2 flex justify-center'>
        <section className='w-full'>
          <div className='items-center justify-center px-6 py-8 mx-auto'>
            <div className='w-full p-6 bg-white rounded-lg shadow'>
              <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl '>
                Forgot Password
              </h2>
              <form className='mt-4 space-y-4 lg:mt-5 md:space-y-5'>
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    placeholder='user@company.com'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type='button'
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
                  onClick={forgotPasswordHandler}
                >
                  Forgot password
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
