import { Link } from 'react-router-dom';
// import logo from '../../assets/images/logo.png'
import {
  FaceSmileIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { logo } from '../../assets/images/image';
import { logout } from '../../components/auth';
import { isLoginSelector, usernameSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';

type Props = {};

export const Header = ({}: Props) => {
  const isLogin = useSelector(isLoginSelector);
  const username = useSelector(usernameSelector) || 'Tài khoản';
  const dispatch = useAppDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className='w-full flex relative bg-white text-gray-500 gap-20 py-3 px-14'>
      <Link to='/' className='flex-shrink-0'>
        <img src={logo} alt='Images_Logo' className='w-24' />
        <div className='flex justify-center items-center mt-2 font-bold text-blue-700'>
          <div>Tốt & nhanh</div>
        </div>
      </Link>
      <div className='flex flex-col w-full'>
        <div className='flex w-full flex-grow items-center gap-5'>
          <div className='border-slate-400 border rounded-md   flex  w-full justify-between'>
            <label className=' ml-2 flex w-full'>
              <MagnifyingGlassIcon className='w-6 block' />

              <input
                type='text'
                name='search'
                className='border-0 w-full  focus:outline-none '
              />
            </label>
            <button className='text-blue-600 font-semibold flex-shrink-0 border-l py-2 px-3 hover:bg-sky-200'>
              Tìm kiếm
            </button>
          </div>
          <div className='flex flex-shrink-0 items-center justify-center'>
            <Link to='/' className='px-2 flex items-center gap-1'>
              <HomeIcon className='w-6' />
              <h3>Trang chủ</h3>
            </Link>
            <Link to='/me' className='px-2 flex items-center gap-1'>
              <FaceSmileIcon className='w-6' />
              <h3>{username}</h3>
            </Link>
            {isLogin && (
              <button
                onClick={logoutHandler}
                type='button'
                className='py-1 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
              >
                Log out
              </button>
            )}
            <Link to='/cart' className='border-l border-slate-400 px-2 flex'>
              <ShoppingCartIcon className='borde-slate-400 w-6' />
            </Link>
          </div>
        </div>
        <div className='flex right-0 justify-end mt-4 items-center'>
          <MapPinIcon className='w-5 mr-1' />
          <p>Giao đến:</p>
          <Link to='/' className='flex text-black underline-offset-1'>
            <p className='ml-2'>Q.Hoàn Kiếm, P.Hàng Trống, Hà Nội</p>
          </Link>
        </div>
      </div>
    </header>
  );
};
