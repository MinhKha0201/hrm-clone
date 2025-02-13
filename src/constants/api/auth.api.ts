export enum AUTH_API {
  AUTH_USER = 'users/me',
  AUTH_LOGIN = 'auth/login',
  AUTH_LOGOUT = 'auth/logout',
  AUTH_CHANGE_PASSWORD = 'users/change-password',
  AUTH_REVOKE_TOKEN = 'auth/revoke-token',
  AUTH_FORGOT_PASSWORD = 'auth/forgot-password',
  AUTH_VERIFY_TOKEN_RESET_PASSWORD = 'auth/verify-token-reset-password',
  AUTH_RESET_PASSWORD = 'auth/reset-password',
}
