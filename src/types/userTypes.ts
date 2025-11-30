import { Role as RoleEnum } from "../generated/graphql";

export interface GoogleUserInfo {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
  }

  export interface UserResponseType {
    id: string;
    email: string;
    role: RoleEnum;
    name: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  }