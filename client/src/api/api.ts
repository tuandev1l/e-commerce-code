import { IResetPasswordState } from '../components/auth';
import { IChangePassword } from '../components/user/ChangePassword';
import { instance } from '../config/axiosConfig';
import { ICartDto } from '../dto/cart.dto';
import { IChangeQuantityOfProductInCart } from '../dto/changeQuantityOfProductInCart.dto';
import { ICreateCheckout } from '../dto/createCheckout.dto';
import { ICreateOrder } from '../dto/createOrder.dto';
import { ILogin } from '../interfaces/login.interface';
import { ISignup } from '../interfaces/signup.interface';
import { IUserAddress } from '../interfaces/userAddress.interface';

export const requestLoginApi = (userData: ILogin) =>
  instance.post('auth/login', userData);
export const requestSignupApi = (userData: ISignup) =>
  instance.post('auth/signup', userData);
export const verifyUserApi = (resetToken: string) =>
  instance.get(`auth/verify/${resetToken}`);
export const forgotPasswordApi = (email: string) =>
  instance.post('auth/forgot-password', { email });
export const resetPasswordApi = (
  resetToken: string,
  resetPassword: IResetPasswordState
) => instance.post(`auth/reset-password/${resetToken}`, resetPassword);
export const changePasswordApi = (data: IChangePassword) =>
  instance.post('auth/change-password', data);

export const getAllProductsApi = () => instance.get('product');
export const getDetailProductApi = (productId: string) =>
  instance.get(`product/${productId}`);

export const addToCartApi = (cartDto: ICartDto) =>
  instance.post('cart/add-to-cart', cartDto);
export const getCartApi = () => instance.get('cart');
export const changeQuantityOfProductInCartApi = (
  productDto: IChangeQuantityOfProductInCart
) => instance.patch('cart/quantity', productDto);

export const addNewAddressApi = (data: { address: IUserAddress }) =>
  instance.post('auth/add-address', data);
export const setDefaultAddressApi = (addressId: string) =>
  instance.post('auth/set-default-address', { addressId });
export const deleteAddressApi = (addressId: string) =>
  instance.delete(`auth/delete-address/${addressId}`);

export const getShopInfoApi = (shopName: string) =>
  instance.get(`shop/${shopName}`);
export const getAllPaymentsApi = () => instance.get('payment');
export const getAllShippingMethodsApi = () => instance.get('shipping');

export const createOrderApi = (orderDto: ICreateOrder) =>
  instance.post('order', orderDto);
export const createCheckoutApi = (checkoutDto: ICreateCheckout) =>
  instance.post('order/get-payment-url', checkoutDto);

export const getAllOrdersApi = () => instance.get('order');
