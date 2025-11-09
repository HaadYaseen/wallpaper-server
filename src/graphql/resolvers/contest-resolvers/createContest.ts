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

    // Calculate endTime from startTime + durationInDays
    const startTime = new Date(input.startTime);
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + input.durationInDays);

    const contest = await prisma.contest.create({
      data: {
        startTime: input.startTime,
        endTime: endTime,
        contestStatus: input.contestStatus,
        contestType: input.contestType,
        totalPrize: input.totalPrize,
        firstPrize: input.firstPrize,
        secondPrize: input.secondPrize,
        thirdPrize: input.thirdPrize,
      },
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
