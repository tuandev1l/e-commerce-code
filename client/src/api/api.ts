import { IResetPasswordState } from '../components/auth';
import { IChangePassword } from '../components/user/ChangePassword';
import { instance } from '../config/axiosConfig';
import { ICartDto } from '../dto/cart.dto';
import { IChangeQuantityOfProductInCart } from '../dto/changeQuantityOfProductInCart.dto';
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
