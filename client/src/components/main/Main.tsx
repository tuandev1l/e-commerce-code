import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import {
  getAllBrandsApi,
  getAllCategoriesApi,
  getAllProductsApi,
} from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { IAxiosError } from '../../config/axiosError.interface';
import { IProductFilter } from '../../dto/productFilter.dto';
import useToast from '../../hook/useToast';
import {
  brandSelectedSelector,
  categorySelectedSelector,
  fromNumberSelector,
  keywordSelector,
  pageSelector,
  productsSelector,
  searchingTypeSelector,
  toNumberSelector,
  totalPageSelector,
  usingKnnSelector,
} from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { ProductItem } from '../product/ProductItem';
import {
  getAllProducts,
  resetProduct,
  setTotalPage,
} from '../product/productSlice';
import { setFromNumber, setPage, setToNumber } from '../product/searchingSlice';
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
  const toast = useToast();
  const [categories, setCategories] = useState<IResponseData[]>([]);
  const [brands, setBrands] = useState<IResponseData[]>([]);
  const [categoryShow, setCategoryShow] = useState<boolean>(false);
  const [brandShow, setBrandShow] = useState<boolean>(false);
  const categoriesSelected = useSelector(categorySelectedSelector);
  const brandsSelected = useSelector(brandSelectedSelector);
  const keyword = useSelector(keywordSelector);
  const page = useSelector(pageSelector);
  const fromNumber = useSelector(fromNumberSelector);
  const toNumber = useSelector(toNumberSelector);
  const totalPage = useSelector(totalPageSelector);
  const usingKnn = useSelector(usingKnnSelector);
  const searchingType = useSelector(searchingTypeSelector);

  useEffect(() => {
    return () => {
      dispatch(setPage(1));
      dispatch(resetProduct());
    };
  }, []);

  const { mutate } = useMutation({
    mutationKey: [
      `product/getAllProducts?page=${page}&keyword=${keyword}&brands=${brandsSelected.toString()}&categories=${categoriesSelected.toString()}&usingKnn=${usingKnn}&searchingType=${searchingType}`,
    ],
    mutationFn: getAllProductsApi,
    onSuccess: (data) => {
      // @ts-ignore
      dispatch(setTotalPage(data.totalPage));
      dispatch(getAllProducts(data.data));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
    gcTime: 0,
  });

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

  useEffect(() => {
    const productFilter: IProductFilter = {
      brands: [],
      categories: [],
      keyword: '',
      fromNumber: 0,
      page: 1,
      toNumber: 99999999,
      usingKnn: false,
      type: searchingType,
    };
    mutate(productFilter);
  }, []);

  const pageChangeHandler = (e: { selected: number }) => {
    const page = e.selected + 1;
    dispatch(setPage(page));

    const productFilter: IProductFilter = {
      brands: brandsSelected,
      categories: categoriesSelected,
      keyword,
      fromNumber,
      page,
      toNumber,
      usingKnn,
      type: searchingType,
    };
    mutate(productFilter);
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
                        <Category key={category._id} category={category} />
                      ))
                  : categories.map((category) => (
                      <Category key={category._id} category={category} />
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
                      .map((brand) => <Brand key={brand._id} brand={brand} />)
                  : brands.map((brand) => (
                      <Brand key={brand._id} brand={brand} />
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
                    value={fromNumber}
                    min={0}
                    onChange={(e) => {
                      let val = +e.target.value;
                      if (val < 0) {
                        val = 0;
                      }
                      dispatch(setFromNumber(val));
                    }}
                  />
                  <input
                    type='number'
                    id='fromNumber'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0'
                    placeholder='₫ ĐẾN'
                    value={toNumber}
                    max={99999999}
                    onChange={(e) => {
                      let val = +e.target.value;
                      if (val > 99999999) {
                        val = 99999999;
                      }
                      dispatch(setToNumber(val));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 sm:text-2xl m-3'>
                Tất cả sản phẩm
              </h2>
              <div className='px-4 mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-4 xl:grid-cols-4'>
                {products.map((product) => (
                  <ProductItem key={product._id} product={product} />
                ))}
              </div>
            </div>

            <div className='w-full flex item-center justify-center mt-4'>
              <ReactPaginate
                nextLabel='>'
                forcePage={page - 1}
                onPageChange={(e) => pageChangeHandler(e)}
                breakLabel='...'
                renderOnZeroPageCount={null}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                pageCount={totalPage}
                previousLabel='<'
                previousLinkClassName='prevent-select relative inline-flex items-center rounded-s-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                pageLinkClassName='prevent-select relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 border-gray-300 hover:bg-indigo-500 hover:text-white focus:z-20 focus:outline-offset-0 border'
                nextLinkClassName='prevent-select relative inline-flex items-center rounded-e-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                breakLinkClassName='prevent-select relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                activeLinkClassName='prevent-select relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                containerClassName='flex'
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
