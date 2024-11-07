import { UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { UserLayout } from './UserLayout';

type Props = {};

export const UserProfile = ({}: Props) => {
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
                  <div className='w-32 h-32 p-4 rounded-full bg-gray-200 flex items-center justify-center'>
                    <UserIcon color='blue' />
                  </div>
                </div>
                <div className='flex flex-col justify-center w-full'>
                  <div className='mb-4'>
                    <label className='block text-gray-600 font-medium'>
                      Họ & Tên
                    </label>
                    <input
                      type='text'
                      value='Trịnh Minh Tuấn BDCCN'
                      className='mt-1 p-2 w-full border border-gray-300 rounded'
                    />
                  </div>
                  <div>
                    <label className='block text-gray-600 font-medium'>
                      Nickname
                    </label>
                    <input
                      type='text'
                      placeholder='Thêm nickname'
                      className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='w-full flex flex-col'>
              <div className='flex-1 mb-4 flex items-center'>
                <label className='block text-gray-600 font-medium w-44'>
                  Ngày sinh
                </label>
                <div className='flex space-x-2 gap-4'>
                  <select className='py-2 px-6 border border-gray-300 rounded bg-white border-1'>
                    <option>Ngày</option>
                    {new Array(31).fill(0).map((_, idx) => (
                      <option value={idx + 1}>{idx + 1}</option>
                    ))}
                  </select>
                  <select className='py-2 px-6 border border-gray-300 rounded bg-white border-1'>
                    <option>Tháng</option>
                    {new Array(12).fill(0).map((_, idx) => (
                      <option value={idx + 1}>{idx + 1}</option>
                    ))}
                  </select>
                  <select className='py-2 px-6 border border-gray-300 rounded bg-white border-1'>
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
                      value=''
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Nam</span>
                  </label>
                  <label className='inline-flex items-center'>
                    <input
                      id='default-radio-1'
                      type='radio'
                      value=''
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Nữ</span>
                  </label>
                  <label className='inline-flex items-center'>
                    <input
                      id='default-radio-1'
                      type='radio'
                      value=''
                      name='default-radio'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    ></input>
                    <span className='ml-2'>Khác</span>
                  </label>
                </div>
              </div>
            </div>
            <div className='flex items-center mt-4 '>
              <label className='block text-gray-600 font-medium w-60'>
                Số điện thoại
              </label>
              <input
                type='text'
                placeholder='0xxxx'
                className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                value={'0779245720'}
              />
            </div>
            <div className='flex items-center'>
              <div className='text-gray-600 font-medium w-60'>Email</div>
              <input
                type='text'
                placeholder='xxx@gmail.com'
                className='mt-1 p-2 w-full border border-gray-300 rounded mb-4'
                value={'tuanprogrammer001@gmail.com'}
              />
            </div>
            <button className='bg-blue-500 text-white mt-6 py-2 w-full rounded'>
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
