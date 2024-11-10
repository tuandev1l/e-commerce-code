import { createSlice } from '@reduxjs/toolkit';
import { shopInitialState } from './shopInitialState';

const shopSlice = createSlice({
  name: 'shop',
  initialState: shopInitialState,
  reducers: {
    getShopInfo: (state, { payload }) => {
      state.shop = payload;
    },
    setProductsOfShop: (state, { payload }) => {
      state.products = payload;
    },
  },
  extraReducers: () => {},
});

export const { getShopInfo, setProductsOfShop } = shopSlice.actions;
export default shopSlice;
