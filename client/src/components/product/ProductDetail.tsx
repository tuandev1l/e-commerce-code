import { Rating } from 'react-simple-star-rating';
import { Layout } from '../../common/layout/Layout';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { priceSplit } from '../../common/price/priceSplit';
import { productSelector, usernameSelector } from '../../store/selector';
import { useAppDispatch } from '../../store/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addToCartApi, getDetailProductApi } from '../../api/api';
import { getDetailProduct } from './productSlice';
import useToast from '../../hook/useToast';
import { IAxiosError } from '../../config/axiosError.interface';

type Props = {};

const fitlerBy = [
  'Mới nhất',
  'Có hình ảnh',
  'Đã mua hàng',
  '5 sao',
  '4 sao',
  '3 sao',
  '2 sao',
  '1 sao',
];

export const ProductDetail = ({}: Props) => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const productId = useParams()['productId'] || '';
  const product = useSelector(productSelector);
  const [imgActive, setImgActive] = useState<number>(0);
  const [option, setOption] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const username = useSelector(usernameSelector);

  const { data } = useQuery({
    queryKey: [`product/getAllProducts/${productId}`],
    queryFn: () => getDetailProductApi(productId),
    gcTime: 60 * 1000 * 10,
    staleTime: 60 * 1000 * 10,
  });

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
                        <a
                          href='#'
                          className='font-medium leading-none text-gray-900'
                        >
                          {`Đã bán: ${product.quantitySold.value}`}
                        </a>
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
                    <div className='p-6 bg-white rounded-lg scroll'>
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
                    </div>
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
              {/* Rating */}
              <div className='col-span-4 bg-white p-6 rounded-lg mt-8'>
                <div className='font-bold text-lg'>Khách hàng đánh giá</div>
                <div className='font-bold mt-4'>Tổng quan</div>
                <div className='flex items-center my-2 gap-4'>
                  <div className='font-bold text-3xl'>
                    {product.ratingAverage}
                  </div>
                  <Rating
                    size={20}
                    readonly
                    transition
                    allowFraction
                    initialValue={product.ratingAverage}
                    SVGclassName={'inline-block'}
                  />
                </div>
                <div className='text-gray-500'>{`(${product.reviewCount} đánh giá)`}</div>
                <div className='mt-4'>
                  {/* 5 stars */}
                  <div className='flex gap-3 w-1/5 items-center'>
                    <Rating
                      size={16}
                      readonly
                      transition
                      allowFraction
                      initialValue={5}
                      SVGclassName={'inline-block'}
                    />
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full'
                        style={{ width: '85%' }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-500'>29</div>
                  </div>

                  {/* 4 stars */}
                  <div className='flex gap-3 w-1/5 items-center'>
                    <Rating
                      size={16}
                      readonly
                      transition
                      allowFraction
                      initialValue={4}
                      SVGclassName={'inline-block'}
                    />
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full'
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-500'>5</div>
                  </div>

                  {/* 3 stars */}
                  <div className='flex gap-3 w-1/5 items-center'>
                    <Rating
                      size={16}
                      readonly
                      transition
                      allowFraction
                      initialValue={3}
                      SVGclassName={'inline-block'}
                    />
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full'
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-500'>0</div>
                  </div>

                  {/* 2 stars */}
                  <div className='flex gap-3 w-1/5 items-center'>
                    <Rating
                      size={16}
                      readonly
                      transition
                      allowFraction
                      initialValue={2}
                      SVGclassName={'inline-block'}
                    />
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full'
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-500'>0</div>
                  </div>

                  {/* 1 stars */}
                  <div className='flex gap-3 w-1/5 items-center'>
                    <Rating
                      size={16}
                      readonly
                      transition
                      allowFraction
                      initialValue={1}
                      SVGclassName={'inline-block'}
                    />
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-blue-600 h-1.5 rounded-full'
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <div className='text-sm text-gray-500'>0</div>
                  </div>
                </div>
                <div className='mt-4'>
                  <div>Tất cả hình ảnh</div>
                  <div>{/* images here */}</div>
                </div>
                <div className='mt-4'>
                  <div className='mb-2'>Lọc theo</div>
                  <div className='flex gap-4'>
                    {fitlerBy.map((el) => (
                      <div
                        className='px-4 py-1 rounded-xl border-gray-200 border-2'
                        key={el}
                      >
                        {el}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Rating element */}
                <div className='mt-8'>
                  <div className='flex gap-8 items-start'>
                    <div className='w-3/12'>
                      <div className='flex items-center mt-4'>
                        {/* Avatar */}
                        <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold'>
                          L
                        </div>
                        <div className='ml-4'>
                          <p className='font-semibold'>Lien</p>
                          <p className='text-sm text-gray-500'>
                            Đã tham gia 8 năm
                          </p>
                        </div>
                      </div>
                      <div className='flex justify-between mt-4 text-sm items-end'>
                        <div className='flex gap-4 items-end'>
                          <img
                            src='https://salt.tikicdn.com/ts/upload/c6/67/f1/444fc9e1869b5d4398cdec3682af7f14.png'
                            width={24}
                          />
                          <div className='text-gray-500'>Đã viết</div>
                        </div>
                        <div>136 Đánh giá</div>
                      </div>
                      <div className='flex justify-between mt-4 text-sm items-end'>
                        <div className='flex gap-4 items-end'>
                          <img
                            src='https://salt.tikicdn.com/ts/upload/cc/86/cd/1d5ac6d4e00abbf6aa4e4636489c9d80.png'
                            width={24}
                          />
                          <div className='text-gray-500'>Đã nhận</div>
                        </div>
                        <div>24 Lượt cảm ơn</div>
                      </div>
                    </div>
                    <div className=''>
                      <div className='flex items-center gap-3'>
                        <Rating
                          size={24}
                          readonly
                          transition
                          allowFraction
                          initialValue={5}
                          SVGclassName={'inline-block'}
                        />
                        <div className='font-semibold text-lg'>
                          Cực kì hài lòng
                        </div>
                      </div>
                      <p className='mt-4'>
                        Quần rất đẹp nha. Mình mua lúc giảm giá còn hơn 200k.
                        Rất đáng tiền
                      </p>
                      <div className='mt-4 w-36 rounded-lg overflow-hidden'>
                        <img src='https://salt.tikicdn.com/cache/750x750/ts/review/ee/c7/66/1fa7eb61d5c32c9c88229ab3672c9704.jpg.webp' />
                      </div>
                      <div className='mt-4 text-gray-500'>
                        <p>Màu: Baby Blue • Kích cỡ: 26</p>
                        <p>Đánh giá vào 2 năm trước • Đã dùng 1 ngày</p>
                      </div>
                      <button className='flex items-center text-blue-500 gap-2 mt-4'>
                        <img
                          src='https://salt.tikicdn.com/ts/upload/10/9f/8b/54e5f6b084fb9e3445036b4646bc48b5.png'
                          width={20}
                        />
                        <span>Hữu ích</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* third column */}
            <div className='p-4 bg-white rounded-lg h-max sticky top-4'>
              <div className='flex gap-4 items-center'>
                <img
                  src={
                    product.seller?.logo
                      ? `https://salt.tikicdn.com/cache/w220/ts/seller/${product.seller.logo}`
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
                      className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-full'
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
