import { createSlice } from '@reduxjs/toolkit';
import { orderInitialState } from './orderInitialState';
import { ORDER_STATUS } from '../../enum';

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
    cancelOrder: (state, { payload }) => {
      const order = state.orders.find((ord) => ord.id === payload);
      if (order) {
        order.status = ORDER_STATUS.CANCEL;
      }
    },
  },
});

export const { getAllOrderDispatch, removeOrderRating, cancelOrder } =
  orderSlice.actions;

export default orderSlice;
