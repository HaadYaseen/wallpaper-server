import { MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const userDelete: MutationResolvers["deleteUser"] = async (
  root,
  args,
  context
) => {
  try {
    const { id } = args;
    const { prisma } = context;

    await prisma.user.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new GraphQLError("An error occurred while deleting user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

