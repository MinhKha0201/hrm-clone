import { TOAST_MESSAGE } from '@/constants/toast-message.constant';
import router from '@/router';
import { useAuthStore } from '@/stores';
import axios from 'axios';
import { toast } from 'vue-sonner';
import { Config } from '@/plugins/config.ts';
import { IApiResponseV1, ITokenResponse } from '@/types';
import ValidateErrorDescription from '@/components/ValidateErrorDescription.vue';
import { h } from 'vue';

const axiosClient = axios.create({
  baseURL: Config.baseURL,
});

const refreshToken = async () => {
  const authStore = useAuthStore();
  const refreshToken = localStorage.getItem(Config.key.refreshToken);

  const { data, status } = await axiosClient.post<IApiResponseV1<ITokenResponse>>(Config.path.refreshToken, {
    refreshToken,
  });

  if (status >= 400) {
    authStore.clearLocalStorage();
    router.push('/login');
    return false;
  }

  const token = data.metadata;
  authStore.setToken(token.accessToken, token.refreshToken);
  return true;
};

const isAllowRefreshToken = (error: any) => {
  return (
    error.response &&
    !error.config._retry &&
    Config.retryStatusCodes.includes(error.response.status) &&
    !error.config?.url?.includes('/login') &&
    !error.config?.url?.includes('/refresh-token')
  );
};

axiosClient.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  config.headers['Access-Control-Allow-Origin'] = '*';

  const accessToken = localStorage.getItem(Config.key.accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (isAllowRefreshToken(error)) {
      const originalRequest = error.config;
      const authStore = useAuthStore();

      originalRequest._retry = true;

      const isSuccess = await refreshToken();
      if (isSuccess) {
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${authStore.access_token}`;
        return axiosClient(originalRequest);
      }

      authStore.clearLocalStorage();
      router.push('/login');
    }

    if (error.status === 422) {
      toast.error(TOAST_MESSAGE.ERROR, {
        description: h(ValidateErrorDescription, { errorList: error.response.data.details }),
      });
      return error.response;
    }

    toast.error(TOAST_MESSAGE.ERROR, {
      description: error.response.data.message,
    });
    return error.response;
  }
);

export default axiosClient;
