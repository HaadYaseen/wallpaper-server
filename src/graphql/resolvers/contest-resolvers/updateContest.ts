import { ContestGraphqlType, MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { requireRole } from "../../../utils/rbac";
import { Role } from "@prisma/client";
import { logger } from "../../../utils/logger";
import { validateInput } from "../../../validation/joiErrorFormatter";
import { updateContestSchema } from "../../../validation/contestValidator";

export const updateContest: MutationResolvers["updateContest"] = async (
  root,
  args,
  context
) => {
  requireRole(context.user, [Role.ADMIN, Role.SUPER_ADMIN]);

  const validatedInput = validateInput(updateContestSchema, args.input);
  const { id, startTime, endTime, contestStatus, contestType, totalPrize, firstPrize, secondPrize, thirdPrize } = validatedInput;

  try {
    const { prisma } = context;

    const existingContest = await prisma.contest.findUnique({
      where: { id },
    });

    if (!existingContest) {
      throw new GraphQLError("Contest not found", {
        extensions: {
          code: "NOT_FOUND",
        },
      });
    }

    const allowedStatuses = ["DRAFT", "UPCOMING", "CANCELLED"];
    const currentStatus = existingContest.contestStatus as string;
    if (!allowedStatuses.includes(currentStatus)) {
      throw new GraphQLError(
        `Contest with status ${existingContest.contestStatus} cannot be updated. Only contests with status DRAFT, UPCOMING, or CANCELLED can be updated.`,
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        }
      );
    }

    const startTimeDate = new Date(startTime);
    const now = new Date();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timeDifference = startTimeDate.getTime() - now.getTime();

    if (timeDifference < oneDayInMs) {
      throw new GraphQLError(
        "Contest start time must be at least one day away from now",
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        }
      );
    }

    const contest = await prisma.contest.update({
      where: { id },
      data: {
        startTime: startTimeDate,
        endTime: new Date(endTime),
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
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    logger.error("Failed to update contest", error, {
      operation: "updateContest",
      userId: context.user?.id,
      contestId: id,
    });
    
    throw new GraphQLError("An error occurred while updating contest", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

