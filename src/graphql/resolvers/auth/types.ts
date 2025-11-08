import { UserGraphqlType } from '../../../generated/graphql';

export interface AuthResponse {
  user: UserGraphqlType;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

