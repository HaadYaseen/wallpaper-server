import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import "graphql-import-node";
import { typeDefs } from "graphql-scalars";
import * as shared from "./schemas/shared.schema.graphql";
import * as user from "./schemas/user.schema.graphql";
import * as auth from "./schemas/auth.schema.graphql";
import * as contest from "./schemas/contest.schema.graphql";
import { resolvers } from "./resolvers";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [
    ...typeDefs,
    shared,
    user,
    auth,
    contest,
  ],
  resolvers,
});

export default schema;

