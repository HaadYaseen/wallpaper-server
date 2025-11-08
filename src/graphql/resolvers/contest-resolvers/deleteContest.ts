import { MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const deleteContest: MutationResolvers["deleteContest"] = async (
  root,
  args,
  context
) => {
  try {
    const { id } = args;
    const { prisma } = context;

    await prisma.contest.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Failed to delete contest:", error);
    throw new GraphQLError("An error occurred while deleting contest", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

