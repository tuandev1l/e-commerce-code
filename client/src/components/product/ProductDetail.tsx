import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment';
import 'moment/dist/locale/vi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import {
  addToCartApi,
  get5ProductsInSimilarCategoryApi,
  getDetailProductApi,
  getProductRatingApi,
  getRandomProductsApi,
} from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { priceSplit } from '../../common/price/priceSplit';
import { IAxiosError } from '../../config/axiosError.interface';
import useToast from '../../hook/useToast';
import { IRatingProduct } from '../../interfaces/ratingProduct.interface';
import { productSelector, usernameSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { ProductRating } from './ProductRating';
import { getDetailProduct } from './productSlice';
import { IProduct } from '../../interfaces';
import { ProductItem } from './ProductItem';
import { TryOn } from './TryOn';

type Props = {};

export const ProductDetail = ({}: Props) => {
  moment.locale('vi');
  const toast = useToast();
  const dispatch = useAppDispatch();
  const productId = useParams()['productId'] || '';
  const product = useSelector(productSelector);
  const [imgActive, setImgActive] = useState<number>(0);
  const [option, setOption] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const username = useSelector(usernameSelector);
  const [ratingProduct, setRatingProduct] = useState<IRatingProduct>();
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const [otherRandomProducts, setOtherRandomProducts] = useState<IProduct[]>(
    []
  );

  const { data } = useQuery({
    queryKey: [`product/getAllProducts/${productId}`],
    queryFn: () => getDetailProductApi(productId),
    gcTime: 60 * 1000 * 10,
    staleTime: 60 * 1000 * 10,
  });

  const { data: ratingProductData } = useQuery({
    queryKey: [`product/ratingProduct/${productId}`],
    queryFn: () => getProductRatingApi(productId),
    enabled: !!productId,
    gcTime: 60 * 1000 * 3,
    staleTime: 60 * 1000 * 3,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (ratingProductData) {
      // @ts-ignore
      setRatingProduct(ratingProductData);
    }
  }, [ratingProductData]);

  useEffect(() => {
    if (data) {
      dispatch(getDetailProduct(data));
    }
  }, [data]);

  useEffect(() => {
    if (product) {
      setOption(new Array(product.configurableOptions.length).fill(0));
    }
  }, [product]);

  const { data: similarProductsData } = useQuery({
    queryKey: [
      `get5ProductsInSimilarCategory/productId=${productId}&categoryId=${product.categories?.id}`,
    ],
    queryFn: () =>
      get5ProductsInSimilarCategoryApi(productId, product.categories?.id!),
    enabled: !!productId && !!product.categories?.id,
    refetchOnWindowFocus: false,
  });

  const { data: randomProductsData } = useQuery({
    queryKey: [`randomProducts`],
    queryFn: getRandomProductsApi,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (randomProductsData) {
      // @ts-ignore
      setOtherRandomProducts(randomProductsData);
    }
  }, [randomProductsData]);

  useEffect(() => {
    if (similarProductsData) {
      // @ts-ignore
      setSimilarProducts(similarProductsData);
    }
  }, [similarProductsData]);

  const { mutate } = useMutation({
    mutationKey: [`addToCart/${username}`],
    mutationFn: addToCartApi,
    onSuccess: () => {
      toast({ type: 'success', message: 'Add to cart successfully' });
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const addToCartHandler = () => {
    let size, color;
    color = product.configurableOptions[0].values[option[0]].label;
    if (option.length === 2) {
      size = product.configurableOptions[1].values[option[1]].label;
    }

    if (productId) {
      mutate({ color, size, productId, quantity });
    }
  };

  return (
    <Layout>
      <section className=''>
        <div className='mx-auto 2xl:px-0'>
          <div className='grid grid-cols-5 gap-6 px-6'>
            <div className='col-span-4 '>
              <div className='flex gap-4'>
                <div className='sticky top-4 h-max col-span-2 w-full bg-white p-6 rounded-lg'>
                  <img
                    className='w-full'
                    src={product.images[imgActive].baseUrl}
                    alt=''
                  />
                  <div className='flex gap-2 mt-4 overflow-x-scroll p-2'>
                    {product.images.map((image, idx) => (
                      <img
                        key={image.baseUrl}
                        src={image.baseUrl}
                        width={64}
                        height={64}
                        onClick={() => setImgActive(idx)}
                        className={`${
                          idx === imgActive &&
                          'solid border-2 border-blue-500 p-1 rounded-lg mr-2'
                        } hover:cursor-pointer`}
                      />
                    ))}
                  </div>
                  <div>
                    <div className='font-bold mt-4 text-lg'>
                      {product.highlight?.title}
                    </div>
                    <div className='mt-2'>
                      {product.highlight?.items.map((item) => (
                        <div
                          className='flex gap-2 mb-2 items-center'
                          key={item}
                        >
                          <img
                            src='https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png'
                            width={24}
                          />
                          <div>{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Badge */}
                <div className='col-span-2 max-w-2xl'>
                  <div className='p-6 bg-white rounded-lg scroll'>
                    <div className='flex gap-6 mb-4'>
                      <div className='flex gap-2'>
                        {product.badges.map((badge) => (
                          <img src={badge.icon} width={88} key={badge.icon} />
                        ))}
                      </div>
                      <div className='text-sm'>{`Thương hiệu: ${product.brand?.name}`}</div>
                    </div>
                    <div className='mt-6 sm:mt-8 lg:mt-0'>
                      <h1 className='text-2xl font-bold text-gray-900 '>
                        {product.name}
                      </h1>
                      <div className='flex items-center gap-4 mt-2 items-center'>
                        <p className='font-medium leading-none text-gray-500 '>
                          {product.ratingAverage}
                        </p>
                        <div className=''>
                          <Rating
                            size={16}
                            readonly
                            transition
                            allowFraction
                            initialValue={product.ratingAverage}
                            SVGclassName={'inline-block'}
                          />
                        </div>
                        <p className='font-medium leading-none text-gray-500 '>
                          {`(${product.reviewCount})`}
                        </p>
                        <div className='font-medium leading-none text-gray-900'>
                          {`Đã bán: ${product.quantitySold?.value ?? 0}`}
                        </div>
                      </div>
                      <div className='mt-4 sm:items-center sm:gap-4 sm:flex'>
                        <p className='text-2xl font-extrabold text-gray-900 text-red-500 font-bold'>
                          {`${priceSplit(product.price)} đ`}
                        </p>
                        {product.discountRate !== 0 && (
                          <>
                            <p className='text-md text-gray-500 px-2 bg-gray-200 rounded-lg'>
                              {`-${product.discountRate}%`}
                            </p>
                            <p className='text-md text-gray-500 line-through'>
                              {`${product.originalPrice} đ`}
                            </p>
                          </>
                        )}
                      </div>
                      <div className='mt-4'>
                        {product.configurableOptions.map(
                          (config, configIdx) => (
                            <>
                              <div>{config.name}</div>
                              <div className='flex gap-2 mt-2 flex-wrap'>
                                {config.values.map((value, valueIdx) => (
                                  <div
                                    onClick={() => {
                                      const newOption = [...option];
                                      newOption[configIdx] = valueIdx;
                                      setOption(newOption);
                                    }}
                                    className={`px-4 py-1 rounded-lg solid border-gray-200 border-2 hover:cursor-pointer ${
                                      option[configIdx] === valueIdx &&
                                      'border-blue-600'
                                    }`}
                                  >
                                    {value.label}
                                  </div>
                                ))}
                              </div>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    {/* <div className='p-6 bg-white rounded-lg scroll'>
                      <div className=''>
                        <div className='font-bold text-lg'>
                          Thông tin vận chuyển
                        </div>
                        <div className='flex justify-between mt-1'>
                          <div>
                            Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội
                          </div>
                          <div className='text-blue-500 font-bold underline'>
                            Đổi
                          </div>
                        </div>
                        <div className='mt-3'>
                          <div className='flex gap-2'>
                            <img
                              src='https://salt.tikicdn.com/ts/upload/14/11/46/13b71dceb805fb57ce37d57585bc3762.png'
                              height={16}
                              width={32}
                            />
                            <div>Giao Thứ Năm</div>
                          </div>
                          <div>
                            Trước 19h, 10/10: 2.700₫
                            <span className='line-through text-gray-400 ml-3'>
                              32.700₫
                            </span>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <div className='mt-4 p-6 bg-white rounded-lg'>
                      <div className=''>
                        <div className='font-bold text-lg'>
                          Thông tin bảo hành
                        </div>
                        <div className='mt-3'>
                          Hướng dẫn bảo hành:{' '}
                          <Link to={'/'}>
                            <span className='text-blue-500'>Xem chi tiết</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className='mt-4 p-6 bg-white rounded-lg'>
                      <div className=''>
                        <div className='font-bold text-lg'>An tâm mua sắm</div>
                        <div className='mt-3'>
                          {product.benefits?.map((benefit) => (
                            <div className='flex gap-2 mb-2' key={benefit.text}>
                              <img src={benefit.icon} width={24} />
                              <div>{benefit.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='mt-4 p-6 bg-white rounded-lg'>
                      <div className=''>
                        <div className='font-bold text-lg'>
                          Thông tin chi tiết
                        </div>
                        <div className='mt-3'>
                          {product.specifications.map((specification) => {
                            const contents = specification.attributes;
                            return (
                              <div className=''>
                                {contents.map((content) => (
                                  <div className='flex mt-3' key={content.name}>
                                    <div className='w-8/12 text-gray-500'>
                                      {content.name}
                                    </div>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: content.value,
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className='p-6 bg-white rounded-lg scroll mt-8'>
                      <div>
                        <div className='font-bold text-lg'>Mô tả sản phẩm</div>
                        <p
                          className='mt-3'
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='p-6 bg-white rounded-lg scroll mt-8'>
                <div className='font-bold text-lg mb-2'>
                  Sản phẩm cùng danh mục
                </div>
                <div className='grid grid-cols-5 gap-3'>
                  {similarProducts.map((pd) => (
                    <ProductItem product={pd} key={pd._id} />
                  ))}
                </div>
              </div>
              <div className='p-6 bg-white rounded-lg scroll mt-8'>
                <div className='font-bold text-lg mb-2'>
                  Sản phẩm có thể bạn quan tâm
                </div>
                <div className='grid grid-cols-5 gap-3'>
                  {otherRandomProducts.map((pd) => (
                    <ProductItem product={pd} key={pd._id} />
                  ))}
                </div>
              </div>

              <TryOn image={product.images[0].baseUrl} />

              {/* Rating */}
              <div className='col-span-4 bg-white p-6 rounded-lg mt-8'>
                <div className='font-bold text-lg'>Khách hàng đánh giá</div>
                <div className='font-bold mt-4'>Tổng quan</div>
                <div className='flex items-center my-2 gap-4'>
                  <div className='font-bold text-3xl'>
                    {ratingProduct?.ratingAverage}
                  </div>
                  <Rating
                    size={20}
                    readonly
                    transition
                    allowFraction
                    initialValue={ratingProduct?.ratingAverage}
                    SVGclassName={'inline-block'}
                  />
                </div>
                <div className='text-gray-500'>{`(${ratingProduct?.reviewsCount} đánh giá)`}</div>
                <div className='mt-4'>
                  {/* 5 stars */}
                  {ratingProduct?.stars &&
                    Object.values(ratingProduct?.stars)
                      .map((star, idx) => (
                        <div className='flex gap-3 w-1/5 items-center'>
                          <Rating
                            size={16}
                            readonly
                            transition
                            allowFraction
                            initialValue={idx + 1}
                            SVGclassName={'inline-block'}
                          />
                          <div className='w-full bg-gray-200 rounded-full h-1.5'>
                            <div
                              className='bg-blue-600 h-1.5 rounded-full'
                              style={{ width: star.percent }}
                            ></div>
                          </div>
                          <div className='text-sm text-gray-500'>
                            {star.count}
                          </div>
                        </div>
                      ))
                      .reverse()}
                </div>
                {/* Rating element */}
                <div className='mt-8'>
                  <ProductRating productId={productId} />
                </div>
              </div>
            </div>
            {/* third column */}
            <div className='p-4 bg-white rounded-lg h-max sticky top-4'>
              <div className='flex gap-4 items-center'>
                <img
                  src={
                    product.seller?.logo
                      ? product.seller.logo.startsWith('http')
                        ? product.seller.logo
                        : `https://salt.tikicdn.com/cache/w220/ts/seller/${product.seller.logo}`
                      : 'https://vcdn.tikicdn.com/cache/w100/ts/seller/8d/05/90/e3a5a6a97a3f5cce051cbf7d6c9e325f.png.webp'
                  }
                  width={60}
                  className='rounded-full'
                />
                <div>
                  <div>{product.seller?.name}</div>
                  <div className='flex gap-1 text-sm'>
                    <div>4.6</div>
                    <span>⭐</span>
                    <div className='text-gray-400'>(2.2k+ đánh giá)</div>
                  </div>
                </div>
              </div>
              <div className='flex items-center mt-8 gap-4'>
                <img src={product.thumbnailUrl} width={52} height={52} />
                <div>
                  {product.configurableOptions
                    .map((opt, idx) => opt.values[option[idx]]?.label)
                    .join(', ')}
                </div>
              </div>
              <div className='mt-6'>
                <div className='font-bold mb-1'>Số Lượng</div>
                <div className='flex gap-2 items-center'>
                  <button
                    type='button'
                    className={`font-bold text-xl focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-0.5 solid border-2 border-gray-200 ${
                      quantity === 1 &&
                      'cursor-not-allowed disabled bg-gray-100'
                    }`}
                    disabled={quantity === 1}
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  >
                    -
                  </button>
                  <input
                    type='number'
                    className='block w-4/12 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500'
                    min={1}
                    max={100}
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                  />
                  <button
                    type='button'
                    className={`font-bold text-xl focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-0.5 solid border-2 border-gray-200 ${
                      quantity === 100 &&
                      'cursor-not-allowed disabled bg-gray-100'
                    }`}
                    disabled={quantity === 100}
                    onClick={() =>
                      setQuantity(quantity < 100 ? quantity + 1 : 100)
                    }
                  >
                    +
                  </button>
                </div>
                <div className='font-bold mt-6'>
                  <div className='text-lg'>Tạm tính</div>
                  <div className='text-2xl mt-1'>{`${priceSplit(
                    product.price * quantity
                  )} đ`}</div>
                  <div className='mt-4'>
                    <button
                      type='button'
                      className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-600 dark:focus:ring-red-900 w-full'
                    >
                      Mua ngay
                    </button>
                    <button
                      type='button'
                      className='text-gray-900 bg-white border-2 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 w-full mt-1'
                      onClick={addToCartHandler}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
