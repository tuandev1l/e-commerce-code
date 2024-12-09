import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getShopInfoByIdApi, updateShopApi } from '../../api/api';
import { IShop } from '../../interfaces';
import { ShopAdminLayout } from './ShopAdminLayout';
import useToast from '../../hook/useToast';
import { IAxiosError } from '../../config/axiosError.interface';

type Props = {};

const shopDefault: IShop = {
  name: '',
  url: '',
  address: {
    country: '',
    detailAddress: '',
    district: '',
    phoneNumber: '',
    province: '',
    ward: '',
    uuid: '',
    isDefault: false,
  },
  logo: '',
  _id: '',
};

export const ShopAdmin = ({}: Props) => {
  const [shopInfo, setShopInfo] = useState<IShop>(shopDefault);
  const shopId = useParams()['shopId'];
  const toast = useToast();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: [`getShop/${shopId}`],
    queryFn: () => getShopInfoByIdApi(shopId!),
    enabled: !!shopId,
  });

  useEffect(() => {
    if (data) {
      // @ts-ignore
      if (!data.approved) {
        toast({ type: 'error', message: 'Shop has not approved by admin yet' });
        navigate(-1);
      }
      // @ts-ignore
      setShopInfo(data);
      // @ts-ignore
      localStorage.setItem('shopName', data.name);
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShopInfo({ ...shopInfo, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // setFormData({ ...formData, logo: e.target.files[0] });
  };

  const { mutate } = useMutation({
    mutationKey: [`updateShopAdmin/${shopId}`],
    mutationFn: updateShopApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Update shop successfully!' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(Object.entries(shopInfo));

    if (Object.values(shopInfo).some((el) => !el)) {
      toast({ type: 'error', message: 'Missing fields' });
      return;
    }
    mutate(shopInfo);
  };

  return (
    <ShopAdminLayout>
      <main className='flex-1 py-2'>
        <h2 className='text-xl font-semibold mb-4'>Thông tin shop</h2>
        <div className='bg-white shadow rounded-lg p-6 pl-0 flex'>
          <div className='flex-1'>
            <div className='flex justify-center items-center bg-white'>
              <form
                onSubmit={handleSubmit}
                className='space-y-6 w-full gap-8 flex'
              >
                <div className='w-1/3 flex justify-center items-center'>
                  <img
                    src={
                      shopInfo.logo
                        ? shopInfo.logo.startsWith('http')
                          ? shopInfo.logo
                          : `https://salt.tikicdn.com/cache/w220/ts/seller/${shopInfo.logo}`
                        : 'https://vcdn.tikicdn.com/cache/w100/ts/seller/8d/05/90/e3a5a6a97a3f5cce051cbf7d6c9e325f.png.webp'
                    }
                  />
                </div>
                <div className='flex gap-4 flex-col flex-1'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Tên shop:
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={shopInfo.name}
                      readOnly
                      className='bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Logo
                    </label>
                    <input
                      type='file'
                      name='logo'
                      onChange={handleFileChange}
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Phone Number
                    </label>
                    <input
                      required={true}
                      type='text'
                      name='phoneNumber'
                      value={shopInfo.address?.phoneNumber}
                      onChange={(e) =>
                        setShopInfo({
                          ...shopInfo,
                          address: {
                            ...shopInfo.address,
                            phoneNumber: e.target.value,
                          },
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                      placeholder='Enter phone number'
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Province
                    </label>
                    <input
                      required={true}
                      type='text'
                      name='province'
                      value={shopInfo.address?.province}
                      onChange={(e) =>
                        setShopInfo({
                          ...shopInfo,
                          address: {
                            ...shopInfo.address,
                            province: e.target.value,
                          },
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                      placeholder='Enter province'
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      District
                    </label>
                    <input
                      required={true}
                      type='text'
                      name='district'
                      value={shopInfo.address?.district}
                      onChange={(e) =>
                        setShopInfo({
                          ...shopInfo,
                          address: {
                            ...shopInfo.address,
                            district: e.target.value,
                          },
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                      placeholder='Enter district'
                    />
                  </div>

                  {/* Ward */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Ward
                    </label>
                    <input
                      required={true}
                      type='text'
                      name='ward'
                      value={shopInfo.address?.ward}
                      onChange={(e) =>
                        setShopInfo({
                          ...shopInfo,
                          address: {
                            ...shopInfo.address,
                            ward: e.target.value,
                          },
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                      placeholder='Enter ward'
                    />
                  </div>

                  {/* Detail Address */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Detail Address
                    </label>
                    <input
                      required={true}
                      type='text'
                      name='detailAddress'
                      value={shopInfo.address?.detailAddress}
                      onChange={(e) =>
                        setShopInfo({
                          ...shopInfo,
                          address: {
                            ...shopInfo.address,
                            detailAddress: e.target.value,
                          },
                        })
                      }
                      className='mt-1 block w-full border border-gray-300 rounded-md p-2'
                      placeholder='Enter detail address'
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button className='bg-blue-500 text-white mt-6 py-2 w-full rounded'>
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* </div> */}
      </main>
    </ShopAdminLayout>
  );
};
