import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../components/auth/authSlice';
import productSlice from '../components/product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import cartSlice from '../components/cart/cartSlice';
import shopSlice from '../components/shop/shopSlice';
import orderSlice from '../components/order/orderSlice';
import searchingSlice from '../components/product/searchingSlice';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    cart: cartSlice.reducer,
    shop: shopSlice.reducer,
    order: orderSlice.reducer,
    searching: searchingSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export default store;
