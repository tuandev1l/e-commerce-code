import { createSlice } from '@reduxjs/toolkit';
import { orderInitialState } from './orderInitialState';

const orderSlice = createSlice({
  name: 'product',
  initialState: orderInitialState,
  reducers: {
    getAllOrderDispatch: (state, { payload }) => {
      state.orders = payload;
    },
    removeOrderRating: (state, { payload }) => {
      const order = state.orders.find((ord) => ord.id === payload);
      if (order) {
        order.ratingId = null;
        order.rating = null;
      }
    },
  },
});

export const { getAllOrderDispatch, removeOrderRating } = orderSlice.actions;

export default orderSlice;
