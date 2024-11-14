import { createSlice } from '@reduxjs/toolkit';
import { productInitialState } from './productSlice.interface';

const productSlice = createSlice({
  name: 'product',
  initialState: productInitialState,
  reducers: {
    getAllProducts: (state, { payload }) => {
      state.products.push(...payload);
    },
    getDetailProduct: (state, { payload }) => {
      state.product = payload;
    },
    resetProduct: (state) => {
      state.products = [];
    },
  },
  extraReducers: () => {},
});

export const { getAllProducts, getDetailProduct, resetProduct } =
  productSlice.actions;
export default productSlice;
