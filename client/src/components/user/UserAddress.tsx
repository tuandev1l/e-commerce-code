import { useState } from 'react';
import { AddressModal } from './AddressModal';
import { UserLayout } from './UserLayout';

type Props = {};

const addresses = [
  {
    id: 1,
    name: 'Trịnh Minh Tuấn',
    phone: '(+84) 779 245 720',
    address:
      'Số nhà 28 Cuối Ngõ 159/37 Phùng Khoang, Phường Trung Văn, Quận Nam Từ Liêm, Hà Nội',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Trịnh Minh Tuấn',
    phone: '(+84) 779 245 720',
    address: 'Đội 4 thôn hành cung, Xã Ninh Thắng, Huyện Hoa Lư, Ninh Bình',
    isDefault: false,
  },
];

export const UserAddress = ({}: Props) => {
  // const [address, setAddress] = useState(addresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <UserLayout>
      <div className='w-full bg-white p-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Địa chỉ của tôi</h2>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-red-600'
            onClick={() => setIsModalOpen(true)}
          >
            + Thêm địa chỉ mới
          </button>
        </div>

        {addresses.map((address) => (
          <div key={address.id} className='mb-6 border-b pb-4'>
            <div className='flex justify-between items-center'>
              <div>
                <p className='font-semibold'>
                  {address.name}{' '}
                  <span className='text-gray-500'>| {address.phone}</span>
                </p>
                <p className='text-gray-600'>{address.address}</p>
                {address.isDefault && (
                  <span className='inline-block mt-2 px-2 py-1 font-semibold text-red-500 border border-red-500 rounded'>
                    Mặc định
                  </span>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex justify-center gap-4'>
                  <button className='text-blue-500 hover:underline'>
                    Cập nhật
                  </button>
                  {!address.isDefault && (
                    <button className='text-blue-500 hover:underline'>
                      Xóa
                    </button>
                  )}
                </div>
                <button className='px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 justify-end m-0'>
                  Thiết lập mặc định
                </button>
              </div>
            </div>
          </div>
        ))}

        <AddressModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      </div>
    </UserLayout>
  );
};
