import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from '../../config/axiosConfig';
import { authSliceInitialState } from './authSlice.interface';

export const signupThunk = createAsyncThunk('auth/signup', async (userData) => {
  const { data } = await instance.post('auth/signup', userData);
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: authSliceInitialState,
  reducers: {
    loginSuccess: (state, { payload }) => {
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('user', JSON.stringify(payload.user));

      state.isLoading = false;
      state.user.id = payload.user.id;
      state.isLogin = !!payload.accessToken;

      state.accessToken = payload.accessToken;
      state.user.id = payload.user.id;
      state.user.name = payload.user.name;
      state.user.birthday = payload.user.birthday;
      state.user.accountType = payload.user.accountType;
      state.user.gender = payload.user.gender;
      state.user.isVerifyEmail = payload.user.isVerifyEmail;
      state.user.isVerifyPhone = payload.user.isVerifyPhone;
      state.user.email = payload.user.email;
      state.user.phoneNumber = payload.user.phoneNumber;
      state.user.avatarUrl = payload.user.avatarUrl;
      state.user.address = payload.user.address;
      state.user.role = payload.user.role;
      state.user.shopId = payload.user.shopId;
    },
    logout: (state) => {
      state.isLogin = false;
      // @ts-ignore
      state.user = {};
      state.accessToken = '';
      localStorage.clear();
    },
    addNewAddressDispatch: (state, { payload }) => {
      state.user.address = payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setShopId: (state, { payload }) => {
      state.user.shopId = payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateUserInfo: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: () => {},
});

export const {
  loginSuccess,
  logout,
  addNewAddressDispatch,
  setShopId,
  updateUserInfo,
} = authSlice.actions;
export default authSlice;
