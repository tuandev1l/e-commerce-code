import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getAllBrandsApi,
  getAllCategoriesApi,
  getAllProductsApi,
} from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { productsSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { ProductItem } from '../product/ProductItem';
import { getAllProducts, resetProduct } from '../product/productSlice';
import { Brand } from './Brand';
import { Category } from './Category';
import './style.css';

type Props = {};

export interface IResponseData {
  _id: string;
  name: string;
  select: boolean;
}

export const Main = ({}: Props) => {
  const dispatch = useAppDispatch();
  const products = useSelector(productsSelector);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const toast = useToast();
  const [categories, setCategories] = useState<IResponseData[]>([]);
  const [brands, setBrands] = useState<IResponseData[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [brandsSelected, setBrandsSelected] = useState<string[]>([]);
  const [categoryShow, setCategoryShow] = useState<boolean>(false);
  const [brandShow, setBrandShow] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setPage(1);
      dispatch(resetProduct());
    };
  }, []);

  const { mutate } = useMutation({
    mutationKey: [`product/getAllProducts?page=${page}`],
    mutationFn: () => getAllProductsApi(page),
    onSuccess: (data) => {
      // @ts-ignore
      setTotalPage(data.totalPage);
      dispatch(getAllProducts(data.data));
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  useEffect(() => {
    mutate();
  }, [page]);

  const showMoreHandler = () => {
    setPage(page + 1);
  };

  const { data: categoriesData } = useQuery({
    queryKey: ['getAllCategories'],
    queryFn: getAllCategoriesApi,
  });

  const { data: brandsData } = useQuery({
    queryKey: ['getAllBrands'],
    queryFn: getAllBrandsApi,
  });

  useEffect(() => {
    if (categoriesData) {
      // @ts-ignore
      const formatCategories = categoriesData.map((category: any) => ({
        _id: category._id,
        name: category.name,
        select: false,
      }));
      setCategories(formatCategories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (brandsData) {
      // @ts-ignore
      const formatBrands = brandsData.map((brand) => ({
        _id: brand._id,
        name: brand.name,
        select: false,
      }));
      setBrands(formatBrands);
    }
  }, [brandsData]);

  const setCheckedCategory = (categoryId: string) => {
    const idx = categoriesSelected.findIndex((cateId) => cateId === categoryId);
    if (idx !== -1) {
      categoriesSelected.splice(idx, 1);
      setCategoriesSelected([...categoriesSelected]);
    } else {
      setCategoriesSelected([...categoriesSelected, categoryId]);
    }
  };

  const setCheckedBrand = (brandId: string) => {
    const idx = brandsSelected.findIndex((cateId) => cateId === brandId);
    if (idx !== -1) {
      brandsSelected.splice(idx, 1);
      setBrandsSelected([...brandsSelected]);
    } else {
      setBrandsSelected([...brandsSelected, brandId]);
    }
  };

  return (
    <Layout>
      <section className='bg-gray-50 p-16 antialiased'>
        <div className='w-full flex'>
          <div
            className={`mb-4 items-end justify-between space-y-4 sm:space-y-0 md:mb-8 p-4 bg-white rounded-lg w-64 h-fit ${
              !categoryShow && !brandShow && 'sticky top-4'
            }`}
          >
            <div>
              <div className='font-bold text-xl mb-2'>Danh mục</div>
              <div className='flex flex-col'>
                {!categoryShow
                  ? categories
                      .slice(0, 5)
                      .map((category) => (
                        <Category
                          key={category._id}
                          setCheckedCategory={setCheckedCategory}
                          category={category}
                        />
                      ))
                  : categories.map((category) => (
                      <Category
                        key={category._id}
                        setCheckedCategory={setCheckedCategory}
                        category={category}
                      />
                    ))}
                {!categoryShow && (
                  <button
                    className='flex items-center gap-2 hover:cursor-pointer'
                    onClick={() => setCategoryShow(true)}
                  >
                    Thêm
                    <ChevronDownIcon width={16} />
                  </button>
                )}
              </div>
            </div>
            <div>
              <div className='font-bold text-xl my-2'>Thương hiệu</div>
              <div className='flex flex-col'>
                {!brandShow
                  ? brands
                      .slice(0, 5)
                      .map((brand) => (
                        <Brand
                          key={brand._id}
                          setCheckedBrand={setCheckedBrand}
                          brand={brand}
                        />
                      ))
                  : brands.map((brand) => (
                      <Brand
                        key={brand._id}
                        setCheckedBrand={setCheckedBrand}
                        brand={brand}
                      />
                    ))}
              </div>
              {!brandShow && (
                <button
                  className='flex items-center gap-2 hover:cursor-pointer'
                  onClick={() => setBrandShow(true)}
                >
                  Thêm
                  <ChevronDownIcon width={16} />
                </button>
              )}
            </div>
            <div>
              <div className='font-bold text-xl my-2'>Khoảng giá</div>
              <div className=''>
                <div className='flex gap-2 mb-2 items-center'>
                  <input
                    type='number'
                    id='fromNumber'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0 removeArrow'
                    placeholder='₫ TỪ'
                  />
                  <input
                    type='number'
                    id='fromNumber'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0'
                    placeholder='₫ ĐẾN'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1'>
            <h2 className='text-xl font-semibold text-gray-900 sm:text-2xl m-3'>
              Tất cả sản phẩm
            </h2>
            <div className='px-4 mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-3'>
              {products.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>

            <div className='flex justify-center items-center'>
              {page !== totalPage && (
                <button
                  type='button'
                  className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 '
                  onClick={showMoreHandler}
                >
                  Show more
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
