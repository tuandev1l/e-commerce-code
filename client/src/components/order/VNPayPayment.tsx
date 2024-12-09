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

  // VNPay
  const orderInfo = query.get('vnp_OrderInfo') || query.get('orderInfo');
  const vnp_TxnRef = query.get('vnp_TxnRef');
  const vnp_TransactionNo = query.get('vnp_TransactionNo');
  const vnp_TransactionStatus = query.get('vnp_TransactionStatus');

  // MOMO
  const momoRequestId = query.get('requestId');
  const momoResultCode = query.get('resultCode');

  const { mutate } = useMutation({
    mutationKey: [`createOrder/${username}`],
    mutationFn: createOrderApi,
    onSuccess: () => {
      if (vnp_TransactionStatus === '00' || momoResultCode === '0') {
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
    console.log(`orderInfo: ${orderInfo}`);
    console.log(`vnp_TransactionStatus: ${vnp_TransactionStatus}`);
    console.log(`momoResultCode: ${momoResultCode}`);

    if (
      orderInfo &&
      (vnp_TransactionStatus !== null || momoResultCode !== null)
    ) {
      console.log('requesting...');
      mutate({
        paymentMethod: vnp_TransactionStatus
          ? PaymentMethodEnum.VNPAY
          : PaymentMethodEnum.MOMO,
        orderInfo,
        vnp_TransactionNo: +vnp_TransactionNo!,
        vnp_TxnRef,
        momoRequestId,
      });
    }
  }, [selectedAddress, products]);

  return (
    <Layout>
      {vnp_TransactionStatus || momoResultCode ? (
        <div>Đang xử lý giao dịch</div>
      ) : (
        <div className='mt-8'>Hành động không hợp lệ, vui lòng thử lại sau</div>
      )}
    </Layout>
  );
};
