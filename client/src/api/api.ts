import { IResetPasswordState } from '../components/auth';
import { IShopDto } from '../components/shop-admin/ShopAdminRegister';
import { IChangePassword } from '../components/user/ChangePassword';
import { instance } from '../config/axiosConfig';
import { ICartDto } from '../dto/cart.dto';
import { IChangeQuantityOfProductInCart } from '../dto/changeQuantityOfProductInCart.dto';
import { ICreateCheckout } from '../dto/createCheckout.dto';
import { ICreateOrder } from '../dto/createOrder.dto';
import { ICreateRatingDto } from '../dto/createRating.dto';
import { IProductFilter } from '../dto/productFilter.dto';
import { IUpdateRatingDto } from '../dto/updateRating.dto';
import { IOrderStatus, IShop } from '../interfaces';
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

export const getAllCategoriesApi = () => instance.get('category');
export const getAllBrandsApi = () => instance.get('brand');
export const getAllProductsApi = (dto: IProductFilter) => {
  console.log(dto);
  return instance.get(
    `product?page=${dto.page}&keyword=${
      dto.keyword
    }&brands=${dto?.brands?.toString()}&categories=${dto?.categories?.toString()}&fromNumber=${
      dto.fromNumber
    }&toNumber=${dto.toNumber}&usingKnn=${dto.usingKnn}&type=${dto.type}`
  );
};

export const getDetailProductApi = (productId: string) =>
  instance.get(`product/${productId}`);

export const addToCartApi = (cartDto: ICartDto) =>
  instance.post('cart/add-to-cart', cartDto);
export const getCartApi = () => instance.get('cart');
export const changeQuantityOfProductInCartApi = (
  productDto: IChangeQuantityOfProductInCart
) => instance.patch('cart/quantity', productDto);
export const removeItemInCartApi = (productId: string) =>
  instance.delete(`cart/${productId}`);

export const addNewAddressApi = (data: { address: IUserAddress }) =>
  instance.post('auth/add-address', data);
export const setDefaultAddressApi = (addressId: string) =>
  instance.post('auth/set-default-address', { addressId });
export const deleteAddressApi = (addressId: string) =>
  instance.delete(`auth/delete-address/${addressId}`);

export const createShopApi = (shopDto: IShopDto) =>
  instance.post('shop', shopDto);
export const getShopInfoApi = (shopName: string) =>
  instance.get(`shop/${shopName}`);
export const getShopInfoByIdApi = (shopId: string) =>
  instance.get(`shop/id/${shopId}`);
export const updateShopApi = (shopDto: IShop) =>
  instance.patch(`shop/${shopDto._id}`, shopDto);
export const getAllProductsOfShopApi = (shopId: string) =>
  instance.get(`product/shop/${shopId}`);
export const deleteProductApi = (productId: string) =>
  instance.delete(`product/${productId}`);
export const getAllShopsNotApprovedApi = () =>
  instance.get('shop/not-approved');
export const approveShopApi = (shopId: string) =>
  instance.patch(`shop/approved/${shopId}`);
export const getAllPaymentsApi = () => instance.get('payment');
export const getAllShippingMethodsApi = () => instance.get('shipping');

export const createOrderApi = (orderDto: ICreateOrder) =>
  instance.post('order', orderDto);
export const createCheckoutApi = (checkoutDto: ICreateCheckout) =>
  instance.post('order/get-payment-url', checkoutDto);
export const getAllOrdersForAdminApi = () =>
  instance.get('order/order-for-admin');
export const updateOrderStatusApi = (updateOrderStatusDto: IOrderStatus) =>
  instance.patch('order', updateOrderStatusDto);
export const getAllOrdersPreparedForShopApi = (shopId: string) =>
  instance.get(`order/order-prepared-for-shop/${shopId}`);
export const getAllOrdersForShopApi = (shopId: string) =>
  instance.get(`order/order-for-shop/${shopId}`);

export const getAllOrdersApi = () => instance.get('order');
export const getProductRatingApi = (productId: string) =>
  instance.get(`rating/product-rating/${productId}`);

export const getAllRatingsOfProductApi = (productId: string) =>
  instance.get(`rating/product/${productId}`);
export const createRatingApi = (ratingDto: ICreateRatingDto) =>
  instance.post('rating', ratingDto);
export const updateRatingApi = (updateRatingDto: IUpdateRatingDto) =>
  instance.patch(`rating/${updateRatingDto.ratingId}`, updateRatingDto);
export const deleteRatingApi = (ratingId: number) =>
  instance.delete(`rating/${ratingId}`);
