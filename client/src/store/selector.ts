import { RootState } from './store';

export const isLoginSelector = (state: RootState) => state.auth.isLogin;
export const productsSelector = (state: RootState) => state.product.products;
export const productSelector = (state: RootState) => state.product.product;
export const usernameSelector = (state: RootState) => state.auth.user.name;
export const productsInCartSelector = (state: RootState) => state.cart.products;
export const totalPriceInCartSelector = (state: RootState) => state.cart.total;
export const discountInCartSelector = (state: RootState) => state.cart.discount;
