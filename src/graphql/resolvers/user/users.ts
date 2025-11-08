import { QueryResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const users: QueryResolvers["users"] = async (
  root,
  args,
  context
) => {
  try {
    const { prisma } = context;
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users as unknown as UserGraphqlType[];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new GraphQLError("An error occurred while fetching users", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

