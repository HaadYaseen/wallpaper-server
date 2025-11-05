import { Resolvers } from '../types';

export const userResolvers: Partial<Resolvers> = {
  Query: {
    users: async (_parent, _args, context) => {
      return await context.prisma.user.findMany();
    },
    user: async (_parent, args, context) => {
      return await context.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    updateUser: async (_parent, args, context) => {
      const updateData: {
        name?: string;
        username?: string;
        avatar?: string | null;
      } = {};
      
      if (args.input.name !== undefined && args.input.name !== null) {
        updateData.name = args.input.name;
      }
      if (args.input.username !== undefined && args.input.username !== null) {
        updateData.username = args.input.username;
      }
      if (args.input.avatar !== undefined) {
        updateData.avatar = args.input.avatar || null;
      }
      
      return await context.prisma.user.update({
        where: { id: args.input.id },
        data: updateData,
      });
    },
    deleteUser: async (_parent, args, context) => {
      await context.prisma.user.delete({
        where: { id: args.id },
      });
      return true;
    },
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
    lastLogin: (parent) => parent.lastLogin.toISOString(),
    bannedAt: (parent) => parent.bannedAt?.toISOString() || null,
    bannedUntil: (parent) => parent.bannedUntil?.toISOString() || null,
  },
};

