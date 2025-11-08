import { MutationResolvers } from "../../../generated/graphql";
import { revokeSession } from "../../../utils/auth";
import { requireAuth } from "../../../utils/rbac";
import { prisma } from "../../../utils/context";

export const logout: MutationResolvers["logout"] = async (
  root,
  args,
  context
) => {
  const user = requireAuth(context.user);

  // Get current session from token
  const authHeader = context.req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        accessToken: token,
        isActive: true,
      },
    });

    if (session) {
      await revokeSession(session.id);
      return true;
    }
  }

  return false;
};

