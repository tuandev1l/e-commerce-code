import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteAddressApi, setDefaultAddressApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { addressSelector, usernameSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { addNewAddressDispatch } from '../auth';
import { AddressModal } from './AddressModal';
import { UserLayout } from './UserLayout';

type Props = {};

export const UserAddress = ({}: Props) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const addresses = useSelector(addressSelector);
  const username = useSelector(usernameSelector);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate } = useMutation({
    mutationKey: [`setDefaultAddress/${username}`],
    mutationFn: setDefaultAddressApi,
    onSuccess: (data) => {
      toast({ type: 'success', message: 'Set default address successfully' });
      dispatch(addNewAddressDispatch(data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const { mutate: deleteAddressMutate } = useMutation({
    mutationKey: [`deleteAddress/${username}`],
    mutationFn: deleteAddressApi,
    onSuccess: (data) => {
      toast({ type: 'success', message: 'Delete address successfully' });
      dispatch(addNewAddressDispatch(data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const setDefaultHandler = (addressId: string) => {
    if (addressId) {
      mutate(addressId);
    }
  };

  const deleteAddressHandler = (addressId: string) => {
    if (addressId) {
      deleteAddressMutate(addressId);
    }
  };

  return (
    <UserLayout>
      <div className='w-full bg-white p-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Địa chỉ của tôi</h2>
          <button
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            onClick={() => setIsModalOpen(true)}
          >
            + Thêm địa chỉ mới
          </button>
        </div>

        {addresses?.length ? (
          addresses.map((address, idx) => (
            <div key={idx} className='mb-6 border-b pb-4 mt-8'>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-semibold'>
                    {username}{' '}
                    <span className='text-gray-500'>
                      | {address.phoneNumber}
                    </span>
                  </p>
                  <p className='text-gray-600 mt-2'>{`${address.detailAddress}, ${address.ward}, ${address.district}, ${address.province}, ${address.country}`}</p>
                  {address.isDefault && (
                    <span className='inline-block mt-2 px-2 py-1 font-semibold text-red-500 border border-red-500 rounded'>
                      Mặc định
                    </span>
                  )}
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-center gap-4'>
                    {!address.isDefault && (
                      <button
                        className='text-blue-500 hover:underline'
                        onClick={() => deleteAddressHandler(address.uuid)}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  {!address.isDefault && (
                    <button
                      className='px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 justify-end m-0'
                      onClick={() => setDefaultHandler(address.uuid)}
                    >
                      Thiết lập mặc định
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='my-24 flex justify-center'>
            Bạn chưa đăng kí địa chỉ nhà để nhận hàng. Vui lòng đăng kí địa chỉ
            nhà để có thể tạo đơn hàng.
          </div>
        )}

        <AddressModal
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      </div>
    </UserLayout>
  );
};
