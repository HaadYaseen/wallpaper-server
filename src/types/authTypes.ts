import { Role } from "@prisma/client";
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
    accessToken: string;
    accessTokenExpiresAt: string;
  }
  
  