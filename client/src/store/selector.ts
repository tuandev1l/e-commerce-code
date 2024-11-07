import { RootState } from './store';

export const isLoginSelector = (state: RootState) => state.auth.isLogin;
export const usernameSelector = (state: RootState) => state.auth.user.name;
export const dobSelector = (state: RootState) => state.auth.user.birthday;
export const phoneSelector = (state: RootState) => state.auth.user.phoneNumber;
export const genderSelector = (state: RootState) => state.auth.user.gender;
export const addressSelector = (state: RootState) => state.auth.user.address;

export const productsSelector = (state: RootState) => state.product.products;
export const productSelector = (state: RootState) => state.product.product;
export const productsInCartSelector = (state: RootState) => state.cart.products;
export const totalPriceInCartSelector = (state: RootState) => state.cart.total;
export const discountInCartSelector = (state: RootState) => state.cart.discount;
