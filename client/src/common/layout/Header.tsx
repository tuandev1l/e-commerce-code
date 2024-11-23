import { Link } from 'react-router-dom';
// import logo from '../../assets/images/logo.png'
import {
  FaceSmileIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllProductsApi } from '../../api/api';
import { logo } from '../../assets/images/image';
import { logout } from '../../components/auth';
import {
  getAllProducts,
  setTotalPage,
} from '../../components/product/productSlice';
import {
  setKeyword,
  setPage,
  setSearchType,
  setUsingKnn,
} from '../../components/product/searchingSlice';
import { IAxiosError } from '../../config/axiosError.interface';
import { IProductFilter, SearchType } from '../../dto/productFilter.dto';
import useToast from '../../hook/useToast';
import {
  addressSelector,
  brandSelectedSelector,
  categorySelectedSelector,
  fromNumberSelector,
  isLoginSelector,
  keywordSelector,
  roleSelector,
  searchingTypeSelector,
  shopIdSelector,
  toNumberSelector,
  usernameSelector,
  usingKnnSelector,
} from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { uploadFile } from '../uploadFile';
import { Role } from '../../enum/role.user.enum';

type Props = {};

export const Header = ({}: Props) => {
  const toast = useToast();
  const isLogin = useSelector(isLoginSelector);
  const username = useSelector(usernameSelector) || 'Tài khoản';
  const addresses = useSelector(addressSelector);
  const [address, setAddress] = useState<string>(
    'P.Hàng Trống, Q.Hoàn Kiếm, Hà Nội'
  );
  const dispatch = useAppDispatch();
  const brandsSelected = useSelector(brandSelectedSelector);
  const categoriesSelected = useSelector(categorySelectedSelector);
  const keyword = useSelector(keywordSelector);
  const fromNumber = useSelector(fromNumberSelector);
  const toNumber = useSelector(toNumberSelector);
  const usingKnn = useSelector(usingKnnSelector);
  const searchingType = useSelector(searchingTypeSelector);
  const shopId = useSelector(shopIdSelector);
  const [checked, setChecked] = useState<boolean>(false);
  const [imgUpload, setImgUpload] = useState<File>();
  const userRole = useSelector(roleSelector);

  useEffect(() => {
    if (addresses?.length && addresses?.length > 0) {
      const addressDefault = addresses.find((add) => add.isDefault);
      if (addressDefault) {
        setAddress(
          `${addressDefault.ward}, ${addressDefault.district}, ${addressDefault.province}`
        );
      }
    }
  }, [addresses]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const { mutate } = useMutation({
    mutationKey: [
      `product/getAllProducts?page=1&keyword=${keyword}&brands=${brandsSelected.toString()}&categories=${categoriesSelected.toString()}&usingKnn=${usingKnn}&searchingType=${searchingType}`,
    ],
    mutationFn: getAllProductsApi,
    onSuccess: (data) => {
      // @ts-ignore
      dispatch(setTotalPage(data.totalPage));
      dispatch(getAllProducts(data.data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
    gcTime: 0,
  });

  const searchingHandler = async () => {
    dispatch(setPage(1));

    console.log(imgUpload);

    const productFilter: IProductFilter = {
      brands: brandsSelected,
      categories: categoriesSelected,
      fromNumber,
      keyword,
      page: 1,
      toNumber,
      usingKnn: checked,
    };

    if (checked || imgUpload) {
      if (imgUpload) {
        const imgUrl = await uploadFile(imgUpload);
        productFilter.keyword = imgUrl;
        productFilter['type'] = SearchType.IMAGE;
        dispatch(setKeyword(imgUrl));
        dispatch(setSearchType(SearchType.IMAGE));
      } else {
        productFilter['type'] = SearchType.TEXT;
        dispatch(setSearchType(SearchType.TEXT));
      }
      productFilter.usingKnn = true;
      dispatch(setUsingKnn(true));
    }
    console.log(`Before request: ${JSON.stringify(productFilter)}`);
    mutate(productFilter);
  };

  const imgUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImgUpload(file);
    } else {
      setImgUpload(undefined);
    }
  };

  return (
    <header className='w-full flex relative bg-white text-gray-500 gap-20 py-3 px-14'>
      <div
        onClick={() => {
          window.location.href = 'http://localhost:5173';
        }}
        className='hover:cursor-pointer'
      >
        <img src={logo} alt='Images_Logo' className='w-24' />
        <div className='flex justify-center items-center mt-2 font-bold text-blue-700'>
          <div>Tốt & nhanh</div>
        </div>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex w-full flex-grow items-center gap-5'>
          <div className='w-full relative'>
            <div className='flex justify-between w-full border-slate-400 border rounded-md'>
              <label className='ml-2 flex w-full gap-2'>
                <MagnifyingGlassIcon className='w-6 block' />
                <input
                  type='text'
                  name='search'
                  className='border-0 w-full focus:outline-none'
                  onChange={(e) => {
                    dispatch(setKeyword(e.target.value));
                  }}
                />
              </label>
              <button
                className='text-blue-600 font-semibold flex-shrink-0 border-l py-2 px-3 hover:bg-sky-200'
                onClick={searchingHandler}
              >
                Tìm kiếm
              </button>
            </div>
            <div>
              <div>
                <div className='mt-2 absolute top-12 flex w-11/12 justify-between pr-1'>
                  <div className='flex items-center'>
                    <input
                      id='default-checkbox'
                      type='checkbox'
                      checked={checked}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                      onChange={() => setChecked(!checked)}
                    />
                    <label
                      htmlFor='default-checkbox'
                      className='ms-2 text-sm font-medium text-gray-900'
                    >
                      Using knn
                    </label>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <label
                      className='block text-sm font-medium text-gray-900 w-fit'
                      htmlFor='file_input'
                    >
                      Hoặc tải ảnh lên tại đây:
                    </label>
                    <input
                      className='block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none'
                      id='file_input'
                      type='file'
                      onChange={(e) => imgUploadHandler(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
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
              <>
                <button
                  onClick={logoutHandler}
                  type='button'
                  className='py-1 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
                >
                  Log out
                </button>
                {userRole === Role.ADMIN ? (
                  <Link to={'/admin'}>
                    <button
                      type='button'
                      className='py-1 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
                    >
                      Admin
                    </button>
                  </Link>
                ) : (
                  <Link
                    to={`${
                      shopId ? `/shop-admin/${shopId}` : '/shop-admin/register'
                    }`}
                  >
                    <button
                      // onClick={}
                      type='button'
                      className='py-1 px-5 mr-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700'
                    >
                      Shop
                    </button>
                  </Link>
                )}
              </>
            )}
            <Link to='/cart' className='border-l border-slate-400 px-2 flex'>
              <ShoppingCartIcon className='borde-slate-400 w-6' />
            </Link>
          </div>
        </div>
        <div className='flex right-0 justify-end mt-4 items-center'>
          <MapPinIcon className='w-5 mr-1' />
          <p>Giao đến: {address}</p>
          <Link to='/' className='flex text-black underline-offset-1'>
            <p className='ml-2'></p>
          </Link>
        </div>
      </div>
    </header>
  );
};
