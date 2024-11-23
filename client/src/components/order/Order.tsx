import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllOrdersApi } from '../../api/api';
import { ORDER_STATUS } from '../../enum';
import { IOrder } from '../../interfaces';
import { ordersSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { UserLayout } from '../user/UserLayout';
import { getAllOrderDispatch } from './orderSlice';
import { SelectedOrder } from './SelectedOrder';

type Props = {};
const btns = [
  {
    name: 'Tất cả đơn',
    status: [ORDER_STATUS.ALL],
  },
  {
    name: 'Chờ thanh toán',
    status: [ORDER_STATUS.PENDING, ORDER_STATUS.UNSUCCESSFUL],
  },
  { name: 'Đang xử lý', status: [ORDER_STATUS.PREPARED] },
  { name: 'Đang vận chuyển', status: [ORDER_STATUS.SHIPPING] },
  { name: 'Đã giao', status: [ORDER_STATUS.COMPLETE] },
  { name: 'Đã hủy', status: [ORDER_STATUS.CANCEL] },
];

export const Order = ({}: Props) => {
  const dispatch = useAppDispatch();
  const [btnActive, setBtnActive] = useState<number>(0);
  const orders = useSelector(ordersSelector);
  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>(orders);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (orders.length) {
      setSelectedOrders(orders);
    }
  }, [orders]);

  const { data } = useQuery({
    queryKey: [''],
    queryFn: getAllOrdersApi,
  });

  useEffect(() => {
    if (data) {
      dispatch(getAllOrderDispatch(data));
    }
  }, [data]);

  const orderStatusBtnHandler = (idx: number) => {
    setBtnActive(idx);
    const status = btns[idx].status;
    const lowerSearch = search.toLowerCase();
    const filterOrders = orders.filter((order) =>
      idx === 0
        ? true
        : status.includes(order.status) &&
          (order.item.seller?.name.toLowerCase().includes(lowerSearch) ||
            order.item.name.toLocaleLowerCase().includes(lowerSearch))
    );
    setSelectedOrders(filterOrders);
  };

  return (
    <UserLayout>
      <div className='min-h-screen'>
        <h2 className='text-xl font-semibold mb-4'>Đơn hàng của tôi</h2>
        <div className='w-full rounded-lg'>
          <div className='flex border-b mb-4 bg-white'>
            {btns.map((btn, idx) => (
              <button
                key={idx}
                className={` ${
                  idx === btnActive
                    ? 'flex-1 px-4 py-2 border-b-2 border-blue-500 text-blue-500 font-semibold'
                    : 'flex-1 px-4 py-2 text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => orderStatusBtnHandler(idx)}
              >
                {btn.name}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className='relative mb-4 hover:cursor-pointer'>
            <input
              type='text'
              placeholder='Tìm đơn hàng theo Nhà bán hoặc Tên sản phẩm'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-medium'
              onClick={() => orderStatusBtnHandler(btnActive)}
            >
              Tìm đơn hàng
            </button>
          </div>

          {selectedOrders.length ? (
            selectedOrders.map((order) => (
              <SelectedOrder key={order.id} order={order} />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='bg-gray-200 rounded-full p-8 mb-4'>
                <img
                  src='https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png'
                  alt='No Orders'
                  className='w-16 h-16'
                />
              </div>
              <p className='text-gray-500'>Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
