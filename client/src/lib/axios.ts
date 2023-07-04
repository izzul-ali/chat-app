import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleLogout } from './auth/signin';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.response.use(
  (resp: AxiosResponse) => {
    return Promise.resolve(resp);
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      return await handleLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
