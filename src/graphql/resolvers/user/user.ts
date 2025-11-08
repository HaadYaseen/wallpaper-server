import { QueryResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const user: QueryResolvers["user"] = async (
  root,
  args,
  context
) => {
  try {
    const { id } = args;
    const { prisma } = context;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return user as unknown as UserGraphqlType;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new GraphQLError("An error occurred while fetching user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

