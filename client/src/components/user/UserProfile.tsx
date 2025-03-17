import { useMutation } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUserInfoApi } from '../../api/api';
import { IAxiosError } from '../../config/axiosError.interface';
import { Gender } from '../../enum/userGender.enum';
import useToast from '../../hook/useToast';
import {
  dobSelector,
  genderSelector,
  usernameSelector,
} from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { updateUserInfo } from '../auth';
import { UserLayout } from './UserLayout';

type Props = {};

export interface IUserInfo {
  name: string;
  birthday: Date;
  gender: Gender;
}

export const UserProfile = ({}: Props) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const dob = useSelector(dobSelector);
  const [fullname, setFullName] = useState<string>(
    useSelector(usernameSelector) || ''
  );
  const [date, setDate] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2000);

  const [gender, setGender] = useState<Gender>(
    useSelector(genderSelector) || Gender.MALE
  );

  useEffect(() => {
    if (dob) {
      const date = moment(dob).local();
      console.log(date);
      setDate(date.date());
      console.log(date.date());
      setMonth(date.month() + 1);
      console.log(date.month());
      setYear(date.year());
    }
  }, [dob]);

  const { mutate } = useMutation({
    mutationKey: [`updateUserInfo/${fullname}`],
    mutationFn: updateUserInfoApi,
    onSuccess: (data) => {
      toast({ type: 'success', message: 'Update user info successfully' });
      dispatch(updateUserInfo(data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const updateProfileHandler = () => {
    const birthday = moment(`${year}-${month}-${date}`);
    const isValidBirthday =
      birthday.isAfter(moment('1900-01-01')) &&
      birthday.isBefore(new Date().toISOString().split('T')[0]);

    if (!isValidBirthday) {
      toast({ type: 'error', message: 'Birthday is not valid' });
      return;
    }
    const userInfo: IUserInfo = {
      name: fullname,
      birthday: birthday.local().toDate(),
      gender,
    };
    mutate(userInfo);
  };

  return (
    <UserLayout>
      <main className='flex-1 py-2'>
        <h2 className='text-xl font-semibold mb-4'>Thông tin tài khoản</h2>
        <div className='bg-white shadow rounded-lg p-6 flex space-x-8'>
          <div className='flex-1'>
            <h3 className='text-lg font-semibold mb-4'>Thông tin cá nhân</h3>
            <div className='flex items-center mb-4 w-full'>
              <div className='flex items-center w-full'>
                <div className='mr-12'>
                  <div className='w-32 h-32 flex items-center justify-center'>
                    <img
                      src={`https://avatar.iran.liara.run/public/boy?username=${fullname}`}
                    />
                  </div>
                </div>
                <div className='flex flex-col justify-center w-full'>
                  <div className='mb-4'>
                    <label className='block text-gray-600 font-medium'>
                      Họ & Tên
                    </label>
                    <input
                      type='text'
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      className='mt-1 p-2 w-full border border-gray-300 rounded'
                    />
                  </div>
                  {/* <div>
                    <label className='block text-gray-600 font-medium'>
                      Nickname
                    </label>
                    <input
                      type='text'
                      placeholder='Thêm nickname'
                      className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                    />
                  </div> */}
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <div className='flex-1 mb-4 flex items-center'>
                <label className='block text-gray-600 font-medium w-44'>
                  Ngày sinh
                </label>
                <div className='flex space-x-2 gap-4'>
                  <select
                    className='py-2 px-6 border border-gray-300 rounded bg-white border-1'
                    value={date}
                    onChange={(e) => {
                      setDate(+e.target.value);
                    }}
                  >
                    <option>Ngày</option>
                    {new Array(31).fill(0).map((_, idx) => (
                      <option value={idx + 1}>{idx + 1}</option>
                    ))}
                  </select>
                  <select
                    className='py-2 px-6 border border-gray-300 rounded bg-white border-1'
                    value={month}
                    onChange={(e) => {
                      setMonth(+e.target.value);
                    }}
                  >
                    <option>Tháng</option>
                    {new Array(12).fill(0).map((_, idx) => (
                      <option value={idx + 1}>{idx + 1}</option>
                    ))}
                  </select>
                  <select
                    className='py-2 px-6 border border-gray-300 rounded bg-white border-1'
                    value={year}
                    onChange={(e) => {
                      setYear(+e.target.value);
                    }}
                  >
                    <option>Năm</option>
                    {new Array(125)
                      .fill(1900)
                      .map((year, idx) => (
                        <option value={year + idx}>{year + idx}</option>
                      ))
                      .reverse()}
                  </select>
                </div>
              </div>
              <div className='flex items-center mt-4'>
                <label className='block text-gray-600 font-medium w-44'>
                  Giới tính
                </label>
                <div className='flex space-x-4 gap-4'>
                  <label className='inline-flex items-center'>
                    <input
                      id='default-radio-1'
                      type='radio'
                      checked={gender === Gender.MALE}
                      onChange={() => setGender(Gender.MALE)}
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Nam</span>
                  </label>
                  <label className='inline-flex items-center'>
                    <input
                      id='default-radio-1'
                      type='radio'
                      checked={gender === Gender.FEMALE}
                      onChange={() => setGender(Gender.FEMALE)}
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Nữ</span>
                  </label>
                  <label className='inline-flex items-center'>
                    <input
                      id='default-radio-1'
                      type='radio'
                      onChange={() => setGender(Gender.OTHER)}
                      checked={gender === Gender.OTHER}
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Khác</span>
                  </label>
                </div>
              </div>
            </div>
            {/* <div className='flex items-center mt-4 '>
              <label className='block text-gray-600 font-medium w-60'>
                Số điện thoại
              </label>
              <input
                type='text'
                placeholder='0xxxx'
                className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div> */}
            {/* <div className='flex items-center'>
              <div className='text-gray-600 font-medium w-60'>Email</div>
              <input
                type='text'
                placeholder='xxx@gmail.com'
                className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                value={'tuanprogrammer001@gmail.com'}
              />
            </div> */}
            <button
              className='bg-blue-500 text-white mt-6 py-2 w-full rounded'
              onClick={updateProfileHandler}
            >
              Lưu thay đổi
            </button>
          </div>
          <div className='w-64 space-y-4'>
            <h3 className='text-lg font-semibold mt-6'>Bảo mật</h3>
            <Link to={'/me/password'}>
              <button className='text-blue-500 font-medium w-full text-left mt-4'>
                Thiết lập mật khẩu
              </button>
            </Link>
            <button className='text-blue-500 font-medium w-full text-left'>
              Yêu cầu xóa tài khoản
            </button>
          </div>
        </div>
      </main>
    </UserLayout>
  );
};
