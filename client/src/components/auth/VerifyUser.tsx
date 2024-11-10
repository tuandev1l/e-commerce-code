import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyUserApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { Layout } from '../../common/layout/Layout';

type Props = {};

export const VerifyUser = ({}: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const resetToken = useParams()['resetToken'];
  const [message, setMessage] = useState<string>('Verify user...');

  const { mutate } = useMutation({
    mutationKey: [`verify-user/${resetToken}`],
    mutationFn: verifyUserApi,
    onSuccess: () => {
      setMessage('Verify user successfully!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    },
    onError: (error: IAxiosError) => {
      setMessage(error.message.toString());
    },
  });

  useEffect(() => {
    if (!resetToken) {
      toast({ type: 'error', message: 'Invalid reset token' });
      return;
    }
    mutate(resetToken);
  }, []);

  return (
    <Layout>
      <div className='pt-8'>{message}</div>
    </Layout>
  );
};
