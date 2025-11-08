import { ContestGraphqlType, QueryResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const contests: QueryResolvers["contests"] = async (
  root,
  args,
  context
) => {
  try {
    const { prisma } = context;
    const contests = await prisma.contest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return contests as unknown as ContestGraphqlType[];
  } catch (error) {
    console.error("Failed to fetch contests:", error);
    throw new GraphQLError("An error occurred while fetching contests", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

