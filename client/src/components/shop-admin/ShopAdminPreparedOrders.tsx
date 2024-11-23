import { useEffect, useState } from 'react';
import { ShopAdminLayout } from './ShopAdminLayout';
import { IOrder } from '../../interfaces';
import { useQuery } from '@tanstack/react-query';
import { getAllOrdersPreparedForShopApi } from '../../api/api';
import { useSelector } from 'react-redux';
import { shopIdSelector } from '../../store/selector';
import { SelectedOrder } from '../order/SelectedOrder';

type Props = {};

export const ShopAdminPreparedOrders = ({}: Props) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const shopId = useSelector(shopIdSelector);

  const { data } = useQuery({
    queryKey: ['preparedOrders'],
    queryFn: () => getAllOrdersPreparedForShopApi(shopId),
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      // @ts-ignore
      setOrders(data);
    }
  }, [data]);

  return (
    <ShopAdminLayout>
      <div>
        <div className='mb-2'>Danh sách các đơn hàng cần chuẩn bị:</div>
        <div>
          {orders.map((order) => (
            <SelectedOrder order={order} />
          ))}
        </div>
      </div>
    </ShopAdminLayout>
  );
};
