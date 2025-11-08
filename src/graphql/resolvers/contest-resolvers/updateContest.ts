import { ContestGraphqlType, MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const updateContest: MutationResolvers["updateContest"] = async (
  root,
  args,
  context
) => {
  try {
    const { input } = args;
    const { prisma } = context; 
    const { id, ...updateData } = input;

    const contest = await prisma.contest.update({
      where: { id },
      data: updateData,
    });

    return contest as unknown as ContestGraphqlType;
  } catch (error) {
    console.error("Failed to update contest:", error);
    throw new GraphQLError("An error occurred while updating contest", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

