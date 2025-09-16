export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
    maxAge: number;
  };
}
export type Token = LoginResponse;

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}
