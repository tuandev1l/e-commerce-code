import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrderApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import { PaymentMethodEnum } from '../../enum/payment.enum';
import useToast from '../../hook/useToast';
import {
  selectedAddressSelector,
  selectedProductSelector,
  usernameSelector,
} from '../../store/selector';

type Props = {};

export const VNPayPayment = ({}: Props) => {
  const search = useLocation().search;
  const navigate = useNavigate();
  const toast = useToast();
  const products = useSelector(selectedProductSelector);
  const selectedAddress = useSelector(selectedAddressSelector);
  const username = useSelector(usernameSelector);
  const query = new URLSearchParams(search);
  const orderInfo = query.get('vnp_OrderInfo');
  const vnp_PayDate = query.get('vnp_PayDate');
  const vnp_TxnRef = query.get('vnp_TxnRef');
  const vnp_TransactionStatus = query.get('vnp_TransactionStatus');

  const { mutate } = useMutation({
    mutationKey: [`createOrder/${username}`],
    mutationFn: createOrderApi,
    onSuccess: (data) => {
      console.log(data);
      if (vnp_TransactionStatus === '00') {
        toast({ type: 'success', message: 'Create order successfully' });
      } else {
        toast({ type: 'error', message: 'Something went wrong with payment' });
      }
      setTimeout(() => {
        navigate('/order');
      }, 500);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  useEffect(() => {
    console.log(search);
    console.log(orderInfo);
    console.log(vnp_PayDate);
    console.log(vnp_TxnRef);

    if (
      search &&
      orderInfo &&
      vnp_PayDate &&
      vnp_TxnRef &&
      vnp_TransactionStatus
    ) {
      mutate({
        paymentMethod: PaymentMethodEnum.VNPAY,
        vnpayParams: search,
        orderInfo,
        vnp_TransactionDate: vnp_PayDate,
        vnp_TxnRef,
        vnp_TransactionStatus,
      });
    }
  }, [selectedAddress, products]);

  return (
    <Layout>
      {query.get('vnp_TransactionStatus') ? (
        <div>Đang xử lý giao dịch</div>
      ) : (
        <div className='mt-8'>Hành động không hợp lệ, vui lòng thử lại sau</div>
      )}
    </Layout>
  );
};
