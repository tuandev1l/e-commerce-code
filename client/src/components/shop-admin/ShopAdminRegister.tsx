import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShopApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { IUserAddress } from '../../interfaces/userAddress.interface';
import { useAppDispatch } from '../../store/store';
import { setShopId } from '../auth';

type Props = {};

export interface IShopDto {
  name: string;
  logo: File | null | string;
  address: Pick<
    IUserAddress,
    'detailAddress' | 'district' | 'province' | 'ward' | 'phoneNumber'
  >;
  description: string;
}

export const ShopAdminRegister = ({}: Props) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IShopDto>({
    name: '',
    logo: 'https://salt.tikicdn.com/cache/w220/ts/seller/8d/05/90/e3a5a6a97a3f5cce051cbf7d6c9e325f.png',
    address: {
      detailAddress: '',
      district: '',
      ward: '',
      province: '',
      phoneNumber: '',
    },
    description: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files && e.target.files.length > 0) {
    //   setFormData({ ...formData, logo: e.target.files[0] });
    // }
  };

  const { mutate } = useMutation({
    mutationKey: ['createShop'],
    mutationFn: createShopApi,
    onSuccess: (data) => {
      toast({
        type: 'success',
        message:
          'Đăng kí shop thành công, shop sẽ được admin duyệt trong thời gian tới',
      });
      // @ts-ignore
      dispatch(setShopId(data._id));
      setTimeout(() => {
        navigate('/');
      }, 500);
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    if (Object.values(formData).some((el) => !el)) {
      toast({ type: 'error', message: 'Missing fields' });
      return;
    }
    mutate(formData);
  };

  return (
    <Layout>
      <div className='flex justify-center items-center min-h-screen w-1/2 bg-gray-100'>
        <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-8'>
          <h2 className='text-2xl font-semibold mb-6'>
            Đăng kí mở shop bán hàng
          </h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Tên shop
              </label>
              <input
                required={true}
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter your name'
              />
            </div>

            {/* Logo Upload Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Logo
              </label>
              <input
                required={true}
                type='file'
                name='logo'
                onChange={handleFileChange}
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Province
              </label>
              <input
                required={true}
                type='text'
                name='province'
                value={formData.address.province}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, province: e.target.value },
                  })
                }
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter province'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                District
              </label>
              <input
                required={true}
                type='text'
                name='district'
                value={formData.address.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, district: e.target.value },
                  })
                }
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter district'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Ward
              </label>
              <input
                required={true}
                type='text'
                name='ward'
                value={formData.address.ward}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, ward: e.target.value },
                  })
                }
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter detail address'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Detail Address
              </label>
              <input
                required={true}
                type='text'
                name='detailAddress'
                value={formData.address.detailAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      detailAddress: e.target.value,
                    },
                  })
                }
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter detail address'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Phone Number
              </label>
              <input
                required={true}
                type='number'
                name='telephone'
                value={formData.address.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                placeholder='Enter phone number'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Mô tả:
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder='Enter description'
                className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600'
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
