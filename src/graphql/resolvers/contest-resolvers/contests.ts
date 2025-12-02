import { ContestGraphqlType, QueryResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { ContestStatus, ContestType } from "@prisma/client";
import { dummyContests } from "../../../data/contests";

export const contests: QueryResolvers["contests"] = async (
  root,
  args,
  context
) => {
  try {
    const { filter, pagination } = args;
    const { prisma } = context;

    const where: any = {};

    if (filter) {
      if (filter.contestStatus) {
        where.contestStatus = filter.contestStatus as ContestStatus;
      }
      if (filter.contestType) {
        where.contestType = filter.contestType as ContestType;
      }
      if (filter.participantId) {
        where.participants = {
          some: {
            id: filter.participantId,
          },
        };
      }
      if (filter.startTime) {
        where.startTime = {
          gte: new Date(filter.startTime),
        };
      }
    }

    const skip = pagination?.skip ?? undefined;
    const take = pagination?.take ?? undefined;

    let results = [...dummyContests];
    console.log("results", results);
    if (filter) {
      if (filter.contestStatus) {
        results = results.filter(
          (c) => c.contestStatus === filter.contestStatus
        );
      }
      if (filter.contestType) {
        results = results.filter((c) => c.contestType === filter.contestType);
      }
      if (filter.startTime) {
        const filterDate = new Date(filter.startTime);
        results = results.filter((c) => c.startTime >= filterDate);
      }
    }

    if (skip !== undefined) {
      results = results.slice(skip);
    }
    if (take !== undefined) {
      results = results.slice(0, take);
    }

    results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    console.log("results2 ", results);
    return results as unknown as ContestGraphqlType[];

  } catch (error) {
    console.error("Failed to fetch contests:", error);
    throw new GraphQLError("An error occurred while fetching contests", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

