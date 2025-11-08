import { Resolvers } from "../../../generated/graphql";
import { contests } from "./contests";
import { contest } from "./contest";
import { createContest } from "./createContest";
import { updateContest } from "./updateContest";
import { deleteContest } from "./deleteContest";

export const contestResolvers: Partial<Resolvers> = {
  Query: {
    contests,
    contest,
  },
  Mutation: {
    createContest,
    updateContest,
    deleteContest,
  },
};
