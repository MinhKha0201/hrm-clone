import { AUTH_API } from '@/constants/api/auth.api';
import axiosApiInstance from '@/plugins';
import router from '@/router';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import {
  ChangePasswordPayload,
  IApiResponseV1,
  ITokenResponse,
  LoginPayload,
  ResetPasswordPayload,
  User,
} from '@/types';
import { Config } from '@/plugins/config.ts';
import { ROLE } from '@/constants';

export const useAuthStore = defineStore('auth-store', () => {
  /**
   *  define state
   */
  const access_token = ref<string>(localStorage.getItem(Config.key.accessToken) || '');
  const refresh_token = ref<string>(localStorage.getItem(Config.key.refreshToken) || '');
  const account = ref<User | null>(
    localStorage.getItem(Config.key.account) ? JSON.parse(localStorage.getItem(Config.key.account) as string) : null
  );

  /**
   *  define getter
   */
  const isLoggedIn = computed(() => access_token.value !== '' && refresh_token.value !== '' && account.value !== null);
  const isAdmin = computed(() => isLoggedIn && account.value?.role?.name === ROLE.ADMIN);

  /**
   *  define action
   */
  const login = async (reqData: LoginPayload) => {
    const { data, status } = await axiosApiInstance.post<IApiResponseV1<ITokenResponse>>(AUTH_API.AUTH_LOGIN, reqData);
    if (status >= 400) {
      return status;
    }
    const token = data.metadata;
    setToken(token.accessToken, token.refreshToken);

    await getUser();
    router.push('/');
  };

  const getUser = async () => {
    const { data, status } = await axiosApiInstance.get<IApiResponseV1<User>>(AUTH_API.AUTH_USER);
    if (status >= 400) {
      return;
    }
    const user = data.metadata;
    account.value = user;
    localStorage.setItem(Config.key.account, JSON.stringify(user));
  };

  const logout = async () => {
    const { status } = await axiosApiInstance.get(AUTH_API.AUTH_LOGOUT);
    if (status >= 400) {
      return;
    }
    clearLocalStorage();
    router.push('/login');
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(Config.key.accessToken);
    localStorage.removeItem(Config.key.refreshToken);
    localStorage.removeItem(Config.key.account);

    access_token.value = '';
    refresh_token.value = '';
    account.value = null;
  };

  const setToken = (accessToken: string, refreshToken: string) => {
    access_token.value = accessToken;
    refresh_token.value = refreshToken;
    localStorage.setItem(Config.key.accessToken, accessToken);
    localStorage.setItem(Config.key.refreshToken, refreshToken);
  };

  const changePassword = async (payload: ChangePasswordPayload) => {
    const { status } = await axiosApiInstance.post(AUTH_API.AUTH_CHANGE_PASSWORD, {
      ...payload,
    });
    if (status >= 400) {
      return status;
    }
    await axiosApiInstance.delete(AUTH_API.AUTH_REVOKE_TOKEN);
    toast.success('Password changed successfully');
    return status;
  };

  const forgotPasswordApi = async (email: string) => {
    const { status } = await axiosApiInstance.post(AUTH_API.AUTH_FORGOT_PASSWORD, { email });

    if (status >= 400) {
      return status;
    }
    return status;
  };

  const verifyTokenResetPassword = async (token: string) => {
    return axiosApiInstance.get(AUTH_API.AUTH_VERIFY_TOKEN_RESET_PASSWORD, { params: { token } });
  };

  const resetPasswordApi = async (data: ResetPasswordPayload) => {
    const { status } = await axiosApiInstance.post(AUTH_API.AUTH_RESET_PASSWORD, data);

    if (status >= 400) {
      return status;
    }
    return status;
  };

  return {
    access_token,
    refresh_token,
    account,
    isLoggedIn,
    isAdmin,
    getUser,
    login,
    logout,
    setToken,
    clearLocalStorage,
    changePassword,
    forgotPasswordApi,
    verifyTokenResetPassword,
    resetPasswordApi,
  };
});
