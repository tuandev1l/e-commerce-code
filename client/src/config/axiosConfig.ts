import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// @ts-ignore
console.log(`BASE_URL: ${process.env.VITE_BASE_URL}`);

export const instance = axios.create({
  baseURL:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:3000/api/v1/'
      : // : 'http://api-ecommerce.localhost/api/v1/',
        // @ts-ignore
        `http://k8s-ecom-fulllsta-43708baa9e-534604237.ap-southeast-1.elb.amazonaws.com/api/v1`,
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
