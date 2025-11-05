import { Resolvers } from '../types';
import { userResolvers } from './user.resolvers';
import { authResolvers } from './auth.resolvers';
import { dummyResolvers } from './dummy.resolvers';

function mergeResolvers(...resolvers: Partial<Resolvers>[]): Resolvers {
  const merged: any = {};

  resolvers.forEach((resolver) => {
    Object.keys(resolver).forEach((key) => {
      if (!merged[key]) {
        merged[key] = {};
      }
      merged[key] = { ...merged[key], ...resolver[key] };
    });
  });

  return merged as Resolvers;
}

export const resolvers: Resolvers = mergeResolvers(
  {
    Query: {
      hello: () => 'Hello from GraphQL Server!',
    },
  },
  userResolvers,
  authResolvers,
  dummyResolvers,
);

