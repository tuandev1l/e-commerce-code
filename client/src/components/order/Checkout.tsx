import { Layout } from '../../common/layout/Layout';

type Props = {};

const Checkout = () => {
  const product = {
    name: 'Ốp lưng Xiaomi Redmi Note 7 / Note 7 Pro / Note 8 Pro',
    price: 8900,
    quantity: 1,
    color: 'Đen',
    type: 'Xiaomi RM Note',
  };

  const insurance = {
    name: 'Bảo hiểm Rơi vỡ màn hình',
    description:
      'Bảo vệ các rủi ro rơi nứt vỡ do sự cố hoặc tai nạn cho màn hình của thiết bị di động.',
    price: 12999,
  };

  const shipping = {
    method: 'Nhanh',
    price: 16500,
    deliveryEstimate: '9 Tháng 11 - 11 Tháng 11',
  };

  const totalPrice =
    product.price * product.quantity + insurance.price + shipping.price;

  return (
    <Layout>
      <div className='w-5/6 mx-auto p-6 bg-white shadow-lg rounded-lg'>
        {/* Address Section */}
        <div className='mb-6 border-b pb-4'>
          <h2 className='text-xl font-semibold mb-2 flex items-center'>
            <span className='text-red-500 mr-2'>📍</span> Địa Chỉ Nhận Hàng
          </h2>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-semibold'>Trịnh Minh Tuấn (+84) 779245720</p>
              <p className='text-gray-600'>
                Số nhà 28 Cuối Ngõ 159/37 Phùng Khoang, Phường Trung Văn, Quận
                Nam Từ Liêm, Hà Nội
              </p>
              <span className='inline-block mt-2 px-2 py-1 text-xs font-semibold text-red-500 border border-red-500 rounded'>
                Mặc định
              </span>
            </div>
            <button className='text-blue-500 hover:underline'>Thay Đổi</button>
          </div>
        </div>

        {/* Product Section */}
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Sản phẩm</h3>
          <div className='flex justify-between items-start pb-4 mb-4 border-b'>
            <div className='flex items-center'>
              <img
                src='product-image-url'
                alt={product.name}
                className='w-20 h-20 mr-4'
              />
              <div>
                <p className='font-semibold'>{product.name}</p>
                <p className='text-gray-600'>
                  Loại: {product.color},{product.type}
                </p>
                <button className='text-xs text-red-500 mt-2'>
                  Đổi ý miễn phí 15 ngày
                </button>
              </div>
            </div>
            <div className='text-right'>
              <p>₫{product.price}</p>
              <p className='mt-2'>Số lượng: {product.quantity}</p>
              <p className='font-semibold mt-2'>
                ₫{product.price * product.quantity}
              </p>
            </div>
          </div>

          {/* Insurance Section */}
          <div className='flex items-center mb-6'>
            <input type='checkbox' id='insurance' className='mr-2' />
            <label htmlFor='insurance' className='text-sm'>
              <p>{insurance.name}</p>
              <p className='text-gray-500 text-xs'>{insurance.description}</p>
            </label>
            <p className='ml-auto font-semibold'>₫{insurance.price}</p>
          </div>

          {/* Seller Notes */}
          <div className='mb-6'>
            <label htmlFor='sellerNote' className='text-sm'>
              Lời nhắn:
            </label>
            <input
              type='text'
              id='sellerNote'
              placeholder='Lưu ý cho Người bán...'
              className='mt-2 w-full p-2 border border-gray-300 rounded'
            />
          </div>
        </div>

        {/* Voucher and Shipping Section */}
        <div className='border-t pt-4'>
          <div className='flex justify-between items-center mb-4'>
            <button className='text-red-500 hover:underline'>
              Chọn Voucher
            </button>
            <div className='text-right'>
              <p className='text-gray-600'>
                Phương thức vận chuyển:{' '}
                <span className='font-semibold'>{shipping.method}</span>
              </p>
              <button className='text-blue-500 hover:underline'>
                Thay Đổi
              </button>
              <p className='text-xs text-gray-500'>
                Đảm bảo nhận hàng từ {shipping.deliveryEstimate}
              </p>
              <p className='font-semibold'>₫{shipping.price}</p>
            </div>
          </div>
        </div>

        {/* Total Section */}
        <div className='border-t pt-4'>
          <div className='flex justify-between items-center'>
            <p className='font-semibold'>Tổng số tiền (1 sản phẩm):</p>
            <p className='text-red-500 text-xl font-bold'>₫{totalPrice}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
