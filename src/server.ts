import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { rateLimiter } from './middleware/rateLimiter';
import { typeDefs, resolvers } from './graphql';
import { createContext } from './utils/context';
import { initializePassport } from './middleware/googleAuth';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app: Express = express();

  // Initialize Passport for Google OAuth
  initializePassport();

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    })
  );

  app.use(express.json());
  app.use(rateLimiter);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: createContext,
    })
  );

  app.listen(Number(PORT), () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
  );
}

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
