import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllProductsApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { productsSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { ProductItem } from '../product/ProductItem';
import { getAllProducts } from '../product/productSlice';

type Props = {};

export const Main = ({}: Props) => {
  const dispatch = useAppDispatch();
  const products = useSelector(productsSelector);

  const { data } = useQuery({
    queryKey: ['product/getAllProducts'],
    queryFn: getAllProductsApi,
    staleTime: 60 * 1000 * 10,
    gcTime: 60 * 1000 * 10,
  });

  useEffect(() => {
    if (data) {
      dispatch(getAllProducts(data));
    }
  }, [data]);

  return (
    <Layout>
      <section className='bg-gray-50 p-16 antialiased'>
        <div className='w-full'>
          <div className='mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8 px-4'>
            <h2 className='mt-3 text-xl font-semibold text-gray-900 sm:text-2xl'>
              Products
            </h2>
          </div>
        </div>

        <div className='px-4 mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4'>
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </div>

        <div className='w-full text-center'>
          <button
            type='button'
            className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 '
          >
            Show more
          </button>
        </div>
      </section>
    </Layout>
  );
};
