import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createCheckoutApi, getAllPaymentsApi } from '../../api/api';
import { Layout } from '../../common/layout/Layout';
import { priceSplit } from '../../common/price/priceSplit';
import { IAxiosError } from '../../config/axiosError.interface';
import { ICreateCheckout } from '../../dto/createCheckout.dto';
import { PaymentMethodEnum } from '../../enum/payment.enum';
import useToast from '../../hook/useToast';
import { IInvoice, IPayment } from '../../interfaces';
import { IUserAddress } from '../../interfaces/userAddress.interface';
import {
  addressSelector,
  selectedProductSelector,
  usernameSelector,
} from '../../store/selector';

type Props = {};

const Checkout = () => {
  const toast = useToast();
  const [payments, setPayments] = useState<IPayment[]>([]);
  const username = useSelector(usernameSelector);
  const addresses = useSelector(addressSelector);
  const products = useSelector(selectedProductSelector);
  const [address, setAddress] = useState<IUserAddress>();
  const priceForProduct = products.reduce(
    (total, product) => (total += product.price * product.quantity),
    0
  );
  const priceForShipping = 10000 * products.length;

  const { data: paymentData } = useQuery({
    queryKey: ['payments'],
    queryFn: getAllPaymentsApi,
  });

  const { mutate } = useMutation({
    mutationKey: [`checkout/${username}`],
    mutationFn: createCheckoutApi,
    onSuccess: (data) => {
      // @ts-ignore
      window.location.href = data.paymentUrl;
    },
    onError: (error: IAxiosError) => {
      toast({ type: 'error', message: error.message });
    },
  });

  const purchaseHandler = () => {
    if (address?.phoneNumber) {
      const checkoutProduct: ICreateCheckout = {
        orders: [],
        paymentMethod: PaymentMethodEnum.VNPAY,
        amount: priceForProduct + priceForShipping,
      };
      for (const product of products) {
        const invoice: IInvoice = {
          itemsQuantity: product.quantity,
          discountAmount: product.discount,
          productPriceTotal: product.quantity * product.price,
          shippingFee: 10000,
          purchasedAt: `${address.detailAddress}, ${address.ward}, ${address.district}, ${address.province}`,
          total: product.quantity * product.price + 10000,
          phoneNumber: address.phoneNumber,
        };
        const shippingId = 1;
        checkoutProduct.orders.push({ invoice, item: product, shippingId });
      }
      console.log(checkoutProduct);
      mutate(checkoutProduct);
    }
  };

  useEffect(() => {
    if (paymentData) {
      // @ts-ignore
      setPayments(paymentData);
    }
  }, [paymentData]);

  useEffect(() => {
    if (addresses) {
      setAddress(addresses.find((address) => address.isDefault));
    }
  }, [addresses]);

  const changeAddressHandler = () => {};

  return (
    <Layout>
      {products.length ? (
        <div className='w-5/6 mx-auto p-6 rounded-lg'>
          <div className='mb-6 border-b p-4 bg-white rounded-md'>
            <h2 className='text-xl font-semibold mb-2 flex items-center'>
              <span className='text-red-500 mr-2 mb-4'>📍</span> Địa Chỉ Nhận
              Hàng
            </h2>
            <div className='flex justify-between items-center'>
              <div>
                <p className='font-semibold'>
                  {username}, {address?.phoneNumber}
                </p>
                <p className='text-gray-600'>
                  {address?.detailAddress}, {address?.ward}, {address?.district}
                  , {address?.province}
                </p>
                <span className='inline-block mt-2 px-2 py-1 text-xs font-semibold text-red-500 border border-red-500 rounded'>
                  Mặc định
                </span>
              </div>
              <button
                className='text-blue-500 hover:underline'
                onClick={changeAddressHandler}
              >
                Thay Đổi
              </button>
            </div>
          </div>

          <div className='mb-6'>
            {products.map((product, idx) => (
              <div key={product.uuid} className='bg-white p-4 mb-8 rounded-md'>
                {idx === 0 && (
                  <h3 className='text-xl font-semibold mb-4'>Sản phẩm</h3>
                )}
                <div className='flex justify-between items-start items-center'>
                  <div className='flex items-center w-2/3'>
                    <img
                      src={product.thumbnailUrl}
                      className='w-32 h-32 mr-4'
                    />
                    <div>
                      <p className='font-semibold line-clamp-2'>
                        {product.name}
                      </p>
                      <p className='text-gray-600'>
                        Loại: {product.color},{product.size}
                      </p>
                      <button className='text-sm text-red-500 mt-2'>
                        Đổi ý miễn phí 15 ngày
                      </button>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='text-right flex items-center gap-4'>
                      <p className='w-32'>Đơn giá</p>
                      <p className='w-32'>Số lượng</p>
                      <p className='font-semibold w-32'>Thành tiền</p>
                    </div>
                    <div className='text-right flex gap-4'>
                      <p className='w-32'>{priceSplit(product.price)}₫</p>
                      <p className='w-32'>{product.quantity}</p>
                      <p className='font-semibold w-32'>
                        {priceSplit(product.price * product.quantity)}₫
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className='flex items-center mb-6'>
                <input type='checkbox' id='insurance' className='mr-2' />
                <label htmlFor='insurance' className='text-sm'>
                  <p>{insurance.name}</p>
                  <p className='text-gray-500 text-xs'>
                    {insurance.description}
                  </p>
                </label>
                <p className='ml-auto font-semibold'>₫{insurance.price}</p>
              </div> */}

                <div className='pt-4'>
                  <div className='flex justify-end'>
                    <div className='flex w-7/12 justify-between items-center mb-4'>
                      <div>Voucher của shop</div>
                      <button
                        type='button'
                        className='text-blue-500 hover:underline'
                      >
                        Chọn Voucher
                      </button>
                    </div>
                  </div>
                  <div className='flex justify-end gap-4'>
                    <div className='flex w-7/12 gap-2'>
                      <p className='text-gray-600'>Phương thức vận chuyển:</p>
                      <div className='flex-1'>
                        <div className='flex justify-between'>
                          <div className='font-semibold'>Nhanh</div>
                          <button className='text-blue-500 hover:underline'>
                            Thay Đổi
                          </button>
                          <div className='font-semibold'>
                            {priceSplit(10000)}₫
                          </div>
                        </div>
                        <div className='text-sm mt-2 text-gray-500'>
                          Đảm bảo nhận hàng từ 9 Tháng 11 - 11 Tháng 11 Nhận
                          Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn
                          sau ngày 11 Tháng 11 2024.
                        </div>
                        <div className='flex gap-8 justify-end items-center mt-4'>
                          <div>Tổng số tiền:</div>
                          <div className='text-xl text-red-600'>
                            {priceSplit(
                              product.quantity * product.price + 10000
                            )}
                            ₫
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className='border-t p-4 sticky b-0 bg-white rounded-md'>
              <div className='mb-16'>
                <div className='text-2xl'>Phương thức thanh toán</div>
                {payments.map((payment) => (
                  <div className='flex items-center mb-4 gap-2 mt-4'>
                    <input
                      id={payment.method}
                      type='radio'
                      value=''
                      name='payment-method'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 outline:none'
                    />
                    <label
                      htmlFor={payment.method}
                      className='flex gap-2 items-center hover:cursor-pointer'
                    >
                      <img src={payment.imgUrl} className='w-12' />
                      <div className='text-lg'>{payment.method}</div>
                    </label>
                  </div>
                ))}
              </div>
              <div className='flex justify-end'>
                <div className='w-96'>
                  <div className='flex flex-col text-lg'>
                    <div className='flex gap-2 font-semibold'>
                      <p className='w-64'>Tổng tiền hàng:</p>
                      <p className='text-right'>
                        {priceSplit(priceForProduct)}₫
                      </p>
                    </div>
                    <div className='flex gap-2 font-semibold mt-2'>
                      <p className='w-64'>Tổng tiền phí vận chuyển:</p>
                      <p className='text-right'>
                        {priceSplit(priceForShipping)}₫
                      </p>
                    </div>
                    <div className='flex gap-2 mt-2'>
                      <p className='font-semibold w-64'>Tổng thanh toán:</p>
                      <p className='text-red-500 text-2xl font-bold'>
                        {priceSplit(priceForProduct + priceForShipping)}₫
                      </p>
                    </div>
                  </div>
                  <button
                    type='button'
                    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg px-5 py-2.5 me-2 mb-2 w-full mt-4'
                    onClick={purchaseHandler}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='pt-6'>
          Bạn phải đăng kí mua hàng ở trong giỏ hàng trước khi đặt hàng ở đây
        </div>
      )}
    </Layout>
  );
};

export default Checkout;
