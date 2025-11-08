import _ from "lodash";
import { userResolvers } from './user/index';
import { authResolvers } from './auth/index';
import { contestResolvers } from './contest-resolvers/index';
import { Resolvers } from "../../generated/graphql";

export const resolvers: Partial<Resolvers> = _.merge(
  userResolvers,
  authResolvers,
  contestResolvers,
);

