import { MutationResolvers } from "../../../generated/graphql";
import { revokeAllUserSessions } from "../../../utils/auth";
import { requireAuth } from "../../../utils/rbac";

export const logoutAll: MutationResolvers["logoutAll"] = async (
  root,
  args,
  context
) => {
  const user = requireAuth(context.user);
  await revokeAllUserSessions(user.id);
  return true;
};

