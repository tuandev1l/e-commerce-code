import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShopInfoApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { useAppDispatch } from '../../store/store';
import { getShopInfo, setProductsOfShop } from './shopSlice';
import { useSelector } from 'react-redux';
import { productsOfShopSelector, shopSelector } from '../../store/selector';

type Props = {};

export const Shop = ({}: Props) => {
  const dispatch = useAppDispatch();
  const shop = useSelector(shopSelector);
  const products = useSelector(productsOfShopSelector);
  const shopName = useParams()['slug'];

  const { data } = useQuery({
    queryKey: [`shop`],
    queryFn: () => getShopInfoApi(`${shopName}`),
    enabled: !!shopName,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  const { data: productsOfShop } = useQuery({
    queryKey: [`products/shop/${shopName}`],
    queryFn: () => {},
    enabled: !!shop.name,
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (productsOfShop) {
      dispatch(setProductsOfShop(productsOfShop));
    }
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(getShopInfo(data));
    }
  }, [data]);

  return (
    <Layout>
      <>
        <div className='w-11/12 mt-0 bg-gradient-to-b from-blue-900 to-black text-white py-4 px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='bg-black rounded-full p-3 flex items-center justify-center'>
                <img
                  src='https://salt.tikicdn.com/cache/w220/ts/seller/8d/05/90/e3a5a6a97a3f5cce051cbf7d6c9e325f.png'
                  alt='AAA Jeans Logo'
                  className='w-12 h-12 object-contain'
                />
              </div>
              <div>
                <h1 className='text-lg font-bold'>AAA Jeans</h1>
                <div className='flex items-center text-sm'>
                  <div className='flex items-center space-x-1 text-yellow-400'>
                    <span>4.6</span>
                    <span>/</span>
                    <span>5</span>
                  </div>
                  <span className='mx-2'>|</span>
                  <div className='flex items-center space-x-1'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 2a7 7 0 017 7c0 7-7 13-7 13S5 16 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' />
                    </svg>
                    <span>Người theo dõi: 3.0k+</span>
                  </div>
                </div>
              </div>
            </div>
            <button className='bg-blue-500 px-4 py-2 rounded text-white font-medium'>
              + Theo Dõi
            </button>
          </div>

          <div className='flex justify-between mt-4 text-sm font-medium'>
            <nav className='space-x-4 text-white'>
              <a href='#' className='border-b-2 border-white pb-1'>
                Cửa Hàng
              </a>
              <a
                href='#'
                className='hover:border-b-2 hover:border-gray-400 pb-1'
              >
                Tất Cả Sản Phẩm
              </a>
              <a
                href='#'
                className='hover:border-b-2 hover:border-gray-400 pb-1'
              >
                Bộ Sưu Tập
              </a>
              <a
                href='#'
                className='hover:border-b-2 hover:border-gray-400 pb-1'
              >
                Giá Sốc Hôm Nay
              </a>
              <a
                href='#'
                className='hover:border-b-2 hover:border-gray-400 pb-1'
              >
                Hồ Sơ Cửa Hàng
              </a>
            </nav>
            <div>
              <input
                type='text'
                placeholder='Tìm sản phẩm tại cửa hàng'
                className='px-3 py-2 text-sm rounded border border-gray-300'
              />
            </div>
          </div>
        </div>
        <div className='flex w-11/12 mt-6 space-x-4 overflow-hidden'>
          <div className='flex-none'>
            <img
              src='https://salt.tikicdn.com/cache/w700/ts/tmp/bf/0f/a8/efb8470f067e4e82b98cba27390170fd.jpg.webp'
              alt='Banner 1'
              className='w-full h-auto rounded-lg object-cover'
            />
          </div>
          <div className='flex-none'>
            <img
              src='https://salt.tikicdn.com/cache/w700/ts/tmp/bf/0f/a8/efb8470f067e4e82b98cba27390170fd.jpg.webp'
              alt='Banner 1'
              className='w-full h-auto rounded-lg object-cover'
            />
          </div>
        </div>
        <div className='w-11/12 bg-white rounded-md mt-8'>
          <div className='flex justify-between mb-2 p-4 pr-6'>
            <div className='text-2xl '>BEST SELLER</div>
            <div className='text-blue-500'>Xem tất cả</div>
          </div>
          {/* {products.map((product) => (
            <ProductItem product={product} />
          ))} */}
        </div>
      </>
    </Layout>
  );
};
