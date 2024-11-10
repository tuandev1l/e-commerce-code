import { createSlice } from '@reduxjs/toolkit';
import { orderInitialState } from './orderInitialState';

const orderSlice = createSlice({
  name: 'product',
  initialState: orderInitialState,
  reducers: {
    getAllOrderDispatch: (state, { payload }) => {
      state.orders = payload;
    },
  },
});

export const { getAllOrderDispatch } = orderSlice.actions;

export default orderSlice;
