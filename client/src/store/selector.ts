import { RootState } from './store';

export const isLoginSelector = (state: RootState) => state.auth.isLogin;
export const usernameSelector = (state: RootState) => state.auth.user.name;
export const dobSelector = (state: RootState) => state.auth.user.birthday;
export const genderSelector = (state: RootState) => state.auth.user.gender;
export const addressSelector = (state: RootState) => state.auth.user.address;
export const shopIdSelector = (state: RootState) => state.auth.user.shopId;
export const roleSelector = (state: RootState) => state.auth.user.role;

export const productsSelector = (state: RootState) => state.product.products;
export const productSelector = (state: RootState) => state.product.product;
export const productsInCartSelector = (state: RootState) => state.cart.products;
export const selectedProductSelector = (state: RootState) =>
  state.cart.productSelected;
export const totalPriceInCartSelector = (state: RootState) => state.cart.total;
export const discountInCartSelector = (state: RootState) => state.cart.discount;
export const numberOfProductSelector = (state: RootState) =>
  state.cart.numberOfProducts;

export const keywordSelector = (state: RootState) => state.searching.keyword;
export const brandSelectedSelector = (state: RootState) =>
  state.searching.brands;
export const categorySelectedSelector = (state: RootState) =>
  state.searching.categories;
export const fromNumberSelector = (state: RootState) =>
  state.searching.fromNumber;
export const toNumberSelector = (state: RootState) => state.searching.toNumber;
export const pageSelector = (state: RootState) => state.searching.page;
export const usingKnnSelector = (state: RootState) => state.searching.usingKnn;
export const searchingTypeSelector = (state: RootState) => state.searching.type;
export const totalPageSelector = (state: RootState) => state.product.totalPage;
export const isLoadingSelector = (state: RootState) => state.product.isLoading;

export const shopSelector = (state: RootState) => state.shop.shop;
export const productsOfShopSelector = (state: RootState) => state.shop.products;
export const selectedAddressSelector = (state: RootState) =>
  state.cart.selectedAddress;
export const ordersSelector = (state: RootState) => state.order.orders;
