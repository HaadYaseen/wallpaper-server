import { GraphQLError } from "graphql";
import { ContestStatus, ContestType, QueryResolvers } from "../../../generated/graphql";

export const contests: QueryResolvers["contests"] = async (
  root,
  args,
  context
) => {
  try {
    const { filter, pagination, sort } = args;
    const { prisma } = context;
    const skip = pagination?.skip ?? 0;
    const take = pagination?.take ?? 10;

    const where: any = {};    
    if (filter) {
      if (filter.contestStatus) {
        where.contestStatus = filter.contestStatus as ContestStatus;
      }
      if (filter.contestType) {
        where.contestType = filter.contestType as ContestType;
      }
      if (filter.participantId) {
        where.participants = { some: { id: filter.participantId } };
      }
      if (filter.startTime) {
        where.startTime = { gte: new Date(filter.startTime) };
      }
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort?.field) {
      const validSortFields = [
        "createdAt",
        "updatedAt",
        "startTime",
        "endTime",
        "contestStatus",
        "contestType",
        "totalPrize",
        "firstPrize",
        "secondPrize",
        "thirdPrize",
      ];
      
      if (validSortFields.includes(sort.field)) {
        orderBy = {
          [sort.field]: sort.order?.toLowerCase() === "asc" ? "asc" : "desc",
        };
      }
    }

    const [contests, totalCount] = await Promise.all([
      prisma.contest.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          wallpapers: true,
          participants: true,
          result: true,
        },
      }),
      prisma.contest.count({ where }),
    ]);

    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(totalCount / take);
    const startIndex = skip + 1;
    const endIndex = Math.min(skip + take, totalCount);

    const paginationResponse = {
      totalCount,
      currentPage,
      itemsPerPage: take,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex,
    };

    return {
      pagination: paginationResponse,
      data: contests,
    };

  } catch (error) {
    console.error("Failed to fetch contests:", error);
    throw new GraphQLError("An error occurred while fetching contests", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

