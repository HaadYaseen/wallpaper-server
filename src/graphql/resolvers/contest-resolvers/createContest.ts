import { ContestGraphqlType, CreateContestInput, MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { requireRole } from "../../../utils/rbac";
import { Role } from "@prisma/client";
import { logger } from "../../../utils/logger";
import { validateInput } from "../../../validation/joiErrorFormatter";
import { createContestSchema } from "../../../validation/contestValidator";

export const createContest: MutationResolvers["createContest"] = async (
  root,
  args,
  context
) => {
  requireRole(context.user, [Role.ADMIN, Role.SUPER_ADMIN]);

  const validatedInput = validateInput<CreateContestInput>(createContestSchema, args.input);
  const { startTime, durationInDays, contestStatus, contestType, totalPrize, firstPrize, secondPrize, thirdPrize } = validatedInput;

  try {
    const { prisma } = context;

    const startTimeDate = new Date(startTime);
    const endTime = new Date(startTimeDate);
    endTime.setDate(endTime.getDate() + durationInDays);

    const contest = await prisma.contest.create({
      data: {
        startTime: startTimeDate,
        endTime: endTime,
        contestStatus: contestStatus,
        contestType: contestType,
        totalPrize,
        firstPrize,
        secondPrize,
        thirdPrize,
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
