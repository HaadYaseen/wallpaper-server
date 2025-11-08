import { me } from "./me";
import { signUp } from "./signUp";
import { login } from "./login";
import { googleAuth } from "./googleAuth";
import { refreshToken } from "./refreshToken";
import { logout } from "./logout";
import { logoutAll } from "./logoutAll";
import { Resolvers } from "../../../generated/graphql";

export const authResolvers: Partial<Resolvers> = {
  Query: {
    me,
  },
  Mutation: {
    signUp,
    login,
    googleAuth,
    refreshToken,
    logout,
    logoutAll,
  },
};

