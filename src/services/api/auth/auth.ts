import { axiosInstance } from '@/services/axiosInstance';

export const loginCheck = () => axiosInstance.get('/login/check');
