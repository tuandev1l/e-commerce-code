import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import useToast from '../../hook/useToast';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { usernameSelector } from '../../store/selector';
import { addNewAddressApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';
import { useAppDispatch } from '../../store/store';
import { addNewAddressDispatch } from '../auth';

type Props = {
  isModalOpen: boolean;
  closeModal: Function;
};

const customStyles = {
  content: {
    backgroundColor: 'transparent',
    border: 0,
  },
};

export interface IProvinceData {
  name: string;
  code: number;
}

export const AddressModal = ({ isModalOpen, closeModal }: Props) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const username = useSelector(usernameSelector);
  const [provinces, setProvinces] = useState<IProvinceData[]>();
  const [districts, setDistricts] = useState<IProvinceData[]>();
  const [wards, setWards] = useState<IProvinceData[]>();
  const [province, setProvince] = useState<IProvinceData>();
  const [district, setDistrict] = useState<IProvinceData>();
  const [ward, setWard] = useState<IProvinceData>();
  const [detailAddress, setDetailAddress] = useState<string>('');
  const [isDefault, setDefault] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const { mutate } = useMutation({
    mutationKey: [`addNewAddress/${username}`],
    mutationFn: addNewAddressApi,
    onSuccess: (data) => {
      toast({ type: 'success', message: 'Add new address successfully' });
      dispatch(addNewAddressDispatch(data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
    onSettled: () => {
      closeModal();
    },
  });

  const createNewAddress = () => {
    if (
      !province?.name ||
      !district?.name ||
      !ward?.name ||
      !detailAddress ||
      !phoneNumber
    ) {
      toast({ type: 'error', message: 'Missing fields' });
      return;
    } else if (!/\d+/.test(phoneNumber) || phoneNumber.trim().length !== 10) {
      toast({ type: 'error', message: 'Invalid phone number' });
      return;
    }
    mutate({
      address: {
        uuid: '',
        phoneNumber,
        country: 'Viet Nam',
        province: province.name,
        district: district.name,
        ward: ward.name,
        detailAddress,
        isDefault,
      },
    });
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('https://provinces.open-api.vn/api/p/');
      setProvinces(
        data.map((p: any) => ({
          name: p.name,
          code: p.code,
        }))
      );
    })();
  }, []);

  useEffect(() => {
    if (province) {
      (async () => {
        const { data } = await axios.get(
          `https://provinces.open-api.vn/api/p/${province.code}?depth=2`
        );
        console.log(data);
        setDistricts(
          data.districts.map((p: any) => ({
            name: p.name,
            code: p.code,
          }))
        );
      })();
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      (async () => {
        const { data } = await axios.get(
          `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
        );
        console.log(data);
        setWards(
          data.wards.map((p: any) => ({
            name: p.name,
            code: p.code,
          }))
        );
      })();
    }
  }, [district]);

  return (
    <Modal
      isOpen={isModalOpen}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
    >
      <div className='max-w-lg mx-auto bg-white p-8 rounded-lg'>
        <h2 className='text-2xl font-semibold mb-6'>Tạo địa chỉ mới</h2>
        <div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Số điện thoại:</label>
            <input
              type='text'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='Nhập số điện thoại'
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          {/* City/Province */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Tỉnh/Thành phố:</label>
            <select
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={JSON.stringify(province)}
              onChange={(e) => {
                setProvince(JSON.parse(e.target.value));
              }}
            >
              <option>Chọn Tỉnh/Thành phố</option>
              {provinces?.length &&
                provinces.map((p) => (
                  <option
                    key={p.code}
                    value={JSON.stringify({ name: p.name, code: p.code })}
                  >
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* District */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Quận huyện:</label>
            <select
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={JSON.stringify(district)}
              onChange={(e) => {
                setDistrict(JSON.parse(e.target.value));
              }}
            >
              <option>Chọn Quận/Huyện</option>
              {districts?.length &&
                districts.map((d) => (
                  <option
                    key={d.code}
                    value={JSON.stringify({ name: d.name, code: d.code })}
                  >
                    {d.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Ward */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Phường xã:</label>
            <select
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={JSON.stringify(ward)}
              onChange={(e) => {
                setWard(JSON.parse(e.target.value));
              }}
            >
              <option>Chọn Phường/Xã</option>
              {wards?.length &&
                wards.map((w) => (
                  <option
                    key={w.code}
                    value={JSON.stringify({ name: w.name, code: w.code })}
                  >
                    {w.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Address */}
          <div className='mb-4'>
            <label className='block text-gray-700'>Địa chỉ chi tiết:</label>
            <textarea
              placeholder='Nhập địa chỉ'
              onChange={(e) => setDetailAddress(e.target.value)}
              value={detailAddress}
              className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            ></textarea>
          </div>

          {/* Default Address Checkbox */}
          <div className='mb-6'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                className='text-blue-500 focus:ring-blue-500 w-4 h-4'
                checked={isDefault}
                onChange={() => setDefault(!isDefault)}
              />
              <span className='ml-2'>Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {/* Update Button */}
          <div className='text-center flex gap-2 justify-center'>
            <button
              className='bg-white text-black px-6 py-1 rounded focus:outline-none border-2 transition'
              onClick={() => closeModal()}
            >
              Trở lại
            </button>
            <button
              className='bg-blue-600 text-white px-6 py-1 rounded focus:outline-none transition'
              onClick={createNewAddress}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
