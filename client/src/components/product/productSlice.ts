import { createSlice } from '@reduxjs/toolkit';
import { productInitialState } from './productSlice.interface';

const productSlice = createSlice({
  name: 'product',
  initialState: productInitialState,
  reducers: {
    getAllProducts: (state, { payload }) => {
      state.products = payload;
    },
    getDetailProduct: (state, { payload }) => {
      state.product = payload;
    },
  },
  extraReducers: () => {},
});

export const { getAllProducts, getDetailProduct } = productSlice.actions;
export default productSlice;
