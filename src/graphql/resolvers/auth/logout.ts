import { MutationResolvers } from "../../../generated/graphql";
import { revokeSession } from "../../../utils/auth";
import { requireAuth } from "../../../utils/rbac";
import { prisma } from "../../../utils/prisma";
import { clearAuthCookies, getAccessTokenFromCookie } from "../../../utils/auth";

export const logout: MutationResolvers["logout"] = async (
  root,
  args,
  context
) => {
  const user = requireAuth(context.user);

  const tokenFromCookie = getAccessTokenFromCookie(context.req);
  // const authHeader = context.req.headers.authorization;
  // const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
    // ? authHeader.substring(7) 
    // : null;
  const token = tokenFromCookie;
  console.log('token from cookie in logout resolver', token);

  if (token) {
    const session = await prisma.session.findFirst({
      where: {
        userId: user.id,
        accessToken: token,
        isActive: true,
      },
    });

    if (session) {
      await revokeSession(session.id);
    }
  }

  clearAuthCookies(context.res);

  return true;
};

