export const Config = {
  baseURL: import.meta.env.VITE_API_URL || 'http://172.16.3.106:3250/api/v1',
  path: {
    refreshToken: '/auth/refresh-token',
  },
  key: {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    account: 'user',
  },
  retryStatusCodes: [401],
};
