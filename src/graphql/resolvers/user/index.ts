import { users } from "./users";
import { user } from "./user";
import { userUpdate } from "./userUpdate";
import { userDelete } from "./userDelete";
import { Resolvers } from "../../../generated/graphql";
// import { userTypeResolvers } from "./userType";

export const userResolvers: Partial<Resolvers> = {
  Query: {
    users,
    user,
  },
  Mutation: {
    updateUser: userUpdate,
    deleteUser: userDelete,
  },
  // User: userTypeResolvers,
};

