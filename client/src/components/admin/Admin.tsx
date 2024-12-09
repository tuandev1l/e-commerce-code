import { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { approveShopApi, getAllShopsNotApprovedApi } from '../../api/api';
import { IShop } from '../../interfaces';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';

type Props = {};

export const Admin = ({}: Props) => {
  const [shops, setShops] = useState<IShop[]>([]);
  const [shopId, setShopId] = useState<string>('');
  const toast = useToast();

  const { data } = useQuery({
    queryKey: ['getAllShopsNotApproved'],
    queryFn: getAllShopsNotApprovedApi,
  });

  useEffect(() => {
    if (data) {
      console.log(data);

      // @ts-ignore
      setShops(data);
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationKey: ['approveShop'],
    mutationFn: approveShopApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Approve shop successfully' });
      const shopRemain = shops.filter((shop) => shop._id !== shopId);
      setShops(shopRemain);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const approveHandler = (id: string) => {
    console.log(id);
    if (confirm('Are you sure about that?')) {
      setShopId(id);
      mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className='mb-2'>Danh sách các shop mở đăng kí bán hàng:</div>
        <div>
          {shops.map((shop) => (
            <div
              key={shop._id}
              className='flex gap-4 mb-4 items-center bg-white p-4 rounded-md'
            >
              <div>
                <img
                  src={
                    shop.logo
                      ? shop.logo.startsWith('http')
                        ? shop.logo
                        : `https://salt.tikicdn.com/cache/w220/ts/seller/${shop.logo}`
                      : 'https://vcdn.tikicdn.com/cache/w100/ts/seller/8d/05/90/e3a5a6a97a3f5cce051cbf7d6c9e325f.png.webp'
                  }
                  className='w-24'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <div>{shop.name}</div>
                <div>
                  Address: {shop.address.detailAddress}, {shop.address.ward},{' '}
                  {shop.address.district}, {shop.address.province}
                </div>
                <div>Phone number: {shop.address.phoneNumber}</div>
                <div>
                  Description:{' '}
                  {shop.description ? shop.description : 'No description'}
                </div>
              </div>
              <div className='flex-1 flex justify-end'>
                <button
                  type='button'
                  className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex gap-2 items-center'
                  onClick={() => approveHandler(shop._id)}
                >
                  <div>Approve</div>
                  <div>
                    <CheckBadgeIcon className='w-4' />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
