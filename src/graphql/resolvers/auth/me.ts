import { QueryResolvers, UserGraphqlType } from "../../../generated/graphql";
import { prisma } from "../../../utils/prisma";

export const me: QueryResolvers["me"] = async (
  root,
  args,
  context
) => {
  if (!context.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: context.user.id },
  });

  return user as unknown as UserGraphqlType;
};

