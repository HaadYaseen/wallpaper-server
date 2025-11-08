import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";

export const userUpdate: MutationResolvers["updateUser"] = async (
  root,
  args, 
  context
) => {
  try {
    const { input } = args;
    const { prisma } = context;
    const { id, ...updateData } = input;

    // Build update data object, only including fields that are provided
    const data: {
      name?: string;
      username?: string;
      avatar?: string | null;
    } = {};

    if (updateData.name !== undefined && updateData.name !== null) {
      data.name = updateData.name;
    }
    if (updateData.username !== undefined && updateData.username !== null) {
      data.username = updateData.username;
    }
    if (updateData.avatar !== undefined) {
      data.avatar = updateData.avatar || null;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return user as unknown as UserGraphqlType;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new GraphQLError("An error occurred while updating user", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
};

