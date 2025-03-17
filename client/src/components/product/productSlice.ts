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
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: () => {},
});

export const {
  getAllProducts,
  getDetailProduct,
  resetProduct,
  setTotalPage,
  setLoading,
} = productSlice.actions;
export default productSlice;
