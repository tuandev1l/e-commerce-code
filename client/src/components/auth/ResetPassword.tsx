import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPasswordApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';

type Props = {};

export interface IResetPasswordState {
  newPassword: string;
  newConfirmPassword: string;
}

export const ResetPassword = ({}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const resetToken = useParams()['resetToken'];

  const [formData, setFormData] = useState<IResetPasswordState>({
    newPassword: '',
    newConfirmPassword: '',
  });

  const { mutate } = useMutation({
    mutationKey: [`reset-password/${resetToken}`],
    mutationFn: () => resetPasswordApi(resetToken!, formData),
    onSuccess: () => {
      toast({ type: 'success', message: 'Password reset successfully' });
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const resetPasswordHandler = () => {
    if (!resetToken || !formData.newPassword || !formData.newConfirmPassword) {
      toast({ type: 'error', message: 'Missing fields' });
      return;
    }
    mutate();
  };

  return (
    <Layout>
      <div className='w-1/2 flex justify-center'>
        <section className='w-full'>
          <div className='items-center justify-center px-6 py-8 mx-auto'>
            <div className='w-full p-6 bg-white rounded-lg shadow'>
              <h2 className='mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl '>
                Reset Password
              </h2>
              <form className='mt-4 space-y-4 lg:mt-5 md:space-y-5'>
                <div>
                  <label
                    htmlFor='new_password'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    New password
                  </label>
                  <input
                    type='password'
                    name='new_password'
                    id='new_password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 '
                    required
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor='confirm-password'
                    className='block mb-2 text-sm font-medium text-gray-900 '
                  >
                    Confirm password
                  </label>
                  <input
                    type='password'
                    name='confirm-password'
                    id='confirm-password'
                    placeholder='••••••••'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 '
                    required
                    value={formData.newConfirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newConfirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  type='button'
                  className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
                  onClick={resetPasswordHandler}
                >
                  Reset password
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};
