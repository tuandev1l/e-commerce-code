import { PhoneIcon } from '@heroicons/react/24/outline';

type Props = {};

export const Footer = ({}: Props) => {
  return (
    <div className='mt-5 w-full p-8 bg-white'>
      <footer id='footer'>
        <div id='main_footer' className='grid grid-cols-5 gap-2'>
          <div>
            <h1 className='font-bold text-lg'>Hỗ trợ khách hàng</h1>
            <div className='text-sm text-gray-600'>
              <div className='mt-2'>Hotline: 1900-6035</div>
              <div className='mt-2'>Các câu hỏi thường gặp</div>
              <div className='mt-2'>Gửi yêu cầu hỗ trợ</div>
              <div className='mt-2'>Hướng dẫn đặt hàng</div>
              <div className='mt-2'>Phương thức vận chuyển</div>
              <div className='mt-2'>Chính sách đổi trả</div>
              <div className='mt-2'>Hướng dẫn trả góp</div>
              <div className='mt-2'>Chính sách hàng nhập khẩu</div>
              <div className='mt-2'>Hỗ trợ khách hàng: hotro@tiki.vn</div>
              <div className='mt-2'>Báo lỗi bảo mật: security@tiki.vn</div>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-lg'>Về Tiki</h1>
            <div className='text-sm text-gray-600'>
              <div className='mt-2'>Giới thiệu Tiki</div>
              <div className='mt-2'>Tiki Blog</div>
              <div className='mt-2'>Tuyển dụng</div>
              <div className='mt-2'>Chính sách bảo mật thanh toán</div>
              <div className='mt-2'>Chính sách bảo mật thông tin cá nhân</div>
              <div className='mt-2'>Chính sách giải quyết khiếu nại</div>
              <div className='mt-2'>Điều khoản sử dụng</div>
              <div className='mt-2'>Giới thiệu Tiki Xu</div>
              <div className='mt-2'>Tiếp thị liên kết cùng Tiki</div>
              <div className='mt-2'>Bán hàng doanh nghiệp</div>
              <div className='mt-2'>Điều kiện vận chuyển</div>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-lg'>Hợp tác và liên kết</h1>
            <div className='text-sm text-gray-600'>
              <div className='mt-2'>Quy chế hoạt động Sàn GDTMĐT</div>
              <div className='mt-2'>Bán hàng cùng Tiki</div>
            </div>
          </div>
          <div>
            <h1 className='font-bold text-lg'>Phương thức thanh toán</h1>

            <div className='flex gap-3 mt-2'>
              {/* {paymentOptions.map((item) => (
                <div key={item.id} className='flex gap-4 items-center'>
                  <div className='flex items-center'>
                    <img
                      src={`${ASSET_API}${item.Icon.url}`}
                      alt=''
                      className='object-cover mr-3  w-10 h-10'
                    />
                  </div>
                </div>
              ))} */}
            </div>
          </div>
          <div>
            <h1 className='font-bold text-lg'>Kết nối với chúng tôi</h1>
            <div className='flex gap-3 mt-2'>
              <PhoneIcon className='w-5 h-5' />
              <div className='text-sm text-gray-500 '>0966068866</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
