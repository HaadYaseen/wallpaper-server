import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { rateLimiter } from './middleware/rateLimiter';
import schema from './graphql';
import { createContext } from './utils/context';
import { initializePassport } from './middleware/googleAuth';
import { statusCodePlugin } from './utils/statusCodePlugin';
import { apiLoggerPlugin } from './utils/apiLoggerPlugin';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app: Express = express();

  initializePassport();

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
    schema,
    plugins: [statusCodePlugin, apiLoggerPlugin],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: createContext,
    })
  );

  app.listen(Number(PORT), () => {
    logger.api.info(`Server started on port ${PORT}`, { port: PORT });
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error: unknown) => {
  logger.error('Failed to start server', error);
  console.error('Failed to start server:', error);
  process.exit(1);
});
