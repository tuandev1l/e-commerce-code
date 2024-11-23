import { useEffect } from 'react';
import useToast from '../../hook/useToast';
import { ShopAdminLayout } from './ShopAdminLayout';
import { useNavigate } from 'react-router-dom';

type Props = {};

export const ShopAdminProductCreate = ({}: Props) => {
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      type: 'success',
      message: 'Sử dụng Postman để demo thay thế chức năng này',
    });

    setTimeout(() => {
      navigate(-1);
    }, 500);
  }, []);

  return (
    <ShopAdminLayout>
      <div></div>
    </ShopAdminLayout>
  );
};
