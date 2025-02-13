// request
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}

// response
export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}
