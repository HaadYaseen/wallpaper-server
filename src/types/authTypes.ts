import { OTPType, Role } from "@prisma/client";
import { UserResponseType } from "./userTypes";

export interface TokenPayload {
    userId: string;
    email: string;
    role: Role;
  }
  
  export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  }
  
  export interface AuthenticatedUser {
    id: string;
    email: string;
    role: Role;
    isActive: boolean;
    isBanned: boolean;
    isVerified: boolean;
  }

  export interface AuthResponse {
    user: UserResponseType;
    message: string;
  }
  
  
export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  username: string;
  avatar?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GoogleAuthInput {
  idToken: string;
}

export interface VerifyEmailInput {
  email: string;
  code: string;
}

export interface RequestOTPInput {
  email: string;
  type: OTPType;
}

export interface RefreshTokenInput {
  refreshToken: string;
}
