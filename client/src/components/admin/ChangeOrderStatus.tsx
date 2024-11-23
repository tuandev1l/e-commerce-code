import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAllOrdersForAdminApi } from '../../api/api';
import { IOrder } from '../../interfaces';
import { SelectedOrder } from '../order/SelectedOrder';
import { AdminLayout } from './AdminLayout';

type Props = {};

export const ChangeOrderStatus = ({}: Props) => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const { data } = useQuery({
    queryKey: ['getAllOrdersForAdmin'],
    queryFn: getAllOrdersForAdminApi,
  });

  useEffect(() => {
    if (data) {
      // @ts-ignore
      setOrders(data);
    }
  }, [data]);

  return (
    <AdminLayout>
      <div>
        <div className='mb-2'>Danh sách các đơn hàng:</div>
        <div>
          {orders.map((order) => (
            <SelectedOrder key={order.id} order={order} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
