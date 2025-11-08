import { QueryResolvers, ContestGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const contest: QueryResolvers["contest"] = async (
  root,
  args,
  context
) => {
  try {
    const { id } = args;
    const { prisma } = context;

    const contest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!contest) {
      return null;
    }

    return contest as unknown as ContestGraphqlType;
  } catch (error) {
    console.error("Failed to fetch contest:", error);
    throw new GraphQLError("An error occurred while fetching contest", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

