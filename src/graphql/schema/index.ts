import { readFileSync } from 'fs';
import { join } from 'path';

const schemaDir = __dirname;

const authSchema = readFileSync(join(schemaDir, 'auth.schema.graphql'), 'utf-8');
const userSchema = readFileSync(join(schemaDir, 'user.schema.graphql'), 'utf-8');
const dummySchema = readFileSync(join(schemaDir, 'dummy.schema.graphql'), 'utf-8');

export const typeDefs = `
type Query {
  hello: String!
}

${userSchema}

${authSchema}

${dummySchema}
`;

