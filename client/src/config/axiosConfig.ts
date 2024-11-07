import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// @ts-ignore
import { SERVER_ADD } from '@env';

export const instance = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
});

instance.interceptors.request.use(function (
  config: InternalAxiosRequestConfig
) {
  config.headers.Authorization =
    'Bearer ' + localStorage.getItem('accessToken');
  return config;
});

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  function (error: Error | AxiosError) {
    if (axios.isAxiosError(error)) {
      return Promise.reject(error.response?.data);
    } else {
      return Promise.reject(error);
    }
  }
);

instance.defaults.headers.common['Authorization'] =
  'Bearer' +
  ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzE2MDkyOTczLCJleHAiOjE3MTg2ODQ5NzN9.kquej5OFjjg0HL54kFd-yskN-gqFIN8imi9pYWzaRN8';
