import { useState } from 'react';
import { UserLayout } from '../user/UserLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import { IProductMinimalWrapper } from '../../interfaces/productMinimalWrapper.interface';

type Props = {};
const btns = [
  'Tất cả đơn',
  'Chờ thanh toán',
  'Đang xử lý',
  'Đang vận chuyển',
  'Đã giao',
  'Đã hủy',
];

export const Order = ({}: Props) => {
  const [btnActive, setBtnActive] = useState<number>(0);
  const products: IProductMinimalWrapper[] = [];

  return (
    <UserLayout>
      <div className='min-h-screen'>
        <h2 className='text-xl font-semibold mb-4'>Đơn hàng của tôi</h2>
        <div className='w-full rounded-lg'>
          <div className='flex border-b mb-4 bg-white'>
            {btns.map((btn, idx) => (
              <button
                className={` ${
                  idx === btnActive
                    ? 'flex-1 px-4 py-2 border-b-2 border-blue-500 text-blue-500 font-semibold'
                    : 'flex-1 px-4 py-2 text-gray-500 hover:text-blue-500'
                }`}
                onClick={() => setBtnActive(idx)}
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className='relative mb-4'>
            <input
              type='text'
              placeholder='Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm'
              className='w-full px-4 py-2 border rounded-lg focus:outline-none'
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-medium'>
              Tìm đơn hàng
            </button>
          </div>

          {products ? (
            products.map((product) => (
              <div
                key={product.seller?.id}
                className='bg-white p-4 pb-2 mb-4 rounded-lg'
              >
                {/* Order Status */}
                <div className='flex justify-between items-center border-b pb-2 mb-2'>
                  <h3 className='font-semibold text-lg'>
                    {product.seller?.name}
                  </h3>
                  <div className='text-green-500 flex items-center gap-2'>
                    <span className='text-md'>Giao hàng thành công</span> |
                    <span className='text-md text-red-500'>HOÀN THÀNH</span>
                  </div>
                </div>

                {/* Product Item Rows */}
                {product.productItem.map((productItem, idx) => (
                  <div
                    key={idx}
                    className='flex justify-between items-center py-1 mb-4'
                  >
                    {/* Image and Product Info */}
                    <div className='flex items-center w-1/2'>
                      <img
                        src={productItem.thumbnailUrl}
                        alt={productItem.name}
                        className='w-16 h-16 rounded-md mr-4'
                      />
                      <div>
                        <p className='font-semibold'>{productItem.name}</p>
                        <p className='text-gray-500 text-sm'>
                          {productItem.color}, {productItem.size}
                        </p>
                        <span className='text-sm text-gray-500'>
                          x{productItem.quantity}
                        </span>
                        <div className='mt-1'>
                          <button className='text-green-500 border border-green-500 text-xs px-2 py-0.5 rounded'>
                            Trả hàng miễn phí 15 ngày
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div className='w-1/3 text-center flex gap-2 items-center justify-center'>
                      <div className='text-red-500 font-semibold'>
                        {productItem.price.toLocaleString()}₫
                      </div>
                      <div className='text-gray-500 line-through text-sm'>
                        {productItem.originalPrice.toLocaleString()}₫
                      </div>
                    </div>

                    {/* Total Price Column */}
                    <div className='w-32 text-center'>
                      <div className='text-red-500 font-semibold'>
                        {(
                          productItem.price * productItem.quantity
                        ).toLocaleString()}
                        ₫
                      </div>
                    </div>

                    {/* Delete Column */}
                    <div className='w-8 text-center flex justify-center items-center'>
                      <TrashIcon
                        width={24}
                        className='text-gray-500 hover:text-red-500 cursor-pointer'
                      />
                    </div>
                  </div>
                ))}

                {/* Total and Action Buttons */}
                <div className='flex justify-between items-center mt-4 border-t pt-4 pb-2'>
                  <div className='text-red-500 text-lg font-semibold'>
                    Thành tiền:{' '}
                    {products
                      .reduce(
                        (total, product) =>
                          total +
                          product.productItem.reduce(
                            (itemTotal, item) =>
                              itemTotal + item.price * item.quantity,
                            0
                          ),
                        0
                      )
                      .toLocaleString()}
                    ₫
                  </div>
                  <div className='flex gap-4'>
                    <button className='bg-red-500 text-white px-4 py-2 rounded'>
                      Mua Lại
                    </button>
                    <button className='border border-gray-300 text-gray-700 px-4 py-2 rounded'>
                      Liên Hệ Người Bán
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='bg-gray-200 rounded-full p-8 mb-4'>
                <img
                  src='https://frontend.tikicdn.com/_desktop-next/static/img/account/empty-order.png'
                  alt='No Orders'
                  className='w-16 h-16'
                />
              </div>
              <p className='text-gray-500'>Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};
