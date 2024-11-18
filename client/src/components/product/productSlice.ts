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
    resetProduct: (state) => {
      state.products = [];
    },
    setTotalPage: (state, { payload }) => {
      state.totalPage = payload;
    },
  },
  extraReducers: () => {},
});

export const { getAllProducts, getDetailProduct, resetProduct, setTotalPage } =
  productSlice.actions;
export default productSlice;
