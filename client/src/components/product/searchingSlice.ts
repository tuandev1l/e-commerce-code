import { createSlice } from '@reduxjs/toolkit';
import { initialSearchingDefault } from './searchingSlice.interface';

const searchingSlice = createSlice({
  name: 'searching',
  initialState: initialSearchingDefault,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload;
    },
    setCheckedCategories: (state, { payload }) => {
      const idx = state.categories.findIndex((cateId) => cateId === payload);
      if (idx !== -1) {
        state.categories.splice(idx, 1);
      } else {
        state.categories.push(payload);
      }
    },
    setCheckedBrand: (state, { payload }) => {
      const idx = state.brands.findIndex((cateId) => cateId === payload);
      if (idx !== -1) {
        state.brands.splice(idx, 1);
      } else {
        state.brands.push(payload);
      }
    },
    setFromNumber: (state, { payload }) => {
      state.fromNumber = payload;
    },
    setToNumber: (state, { payload }) => {
      state.toNumber = payload;
    },
    setPage: (state, { payload }) => {
      state.page = payload;
    },
    setUsingKnn: (state, { payload }) => {
      state.usingKnn = payload;
    },
    setSearchType: (state, { payload }) => {
      state.type = payload;
    },
  },
});

export const {
  setKeyword,
  setCheckedBrand,
  setCheckedCategories,
  setFromNumber,
  setToNumber,
  setPage,
  setUsingKnn,
  setSearchType,
} = searchingSlice.actions;

export default searchingSlice;
