import { ContestGraphqlType, MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { requireRole } from "../../../utils/rbac";
import { Role } from "@prisma/client";
import { logger } from "../../../utils/logger";

export const createContest: MutationResolvers["createContest"] = async (
  root,
  args,
  context
) => {
  requireRole(context.user, [Role.ADMIN, Role.SUPER_ADMIN]);

  try {
    const { input } = args;
    const { prisma } = context;

    const contest = await prisma.contest.create({
      data: { ...input },
    });

    return contest as unknown as ContestGraphqlType;
  } catch (error) {
    logger.error("Failed to create contest", error, {
      operation: "createContest",
      userId: context.user?.id,
    });
    throw new GraphQLError("An error occurred while creating contest", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};
