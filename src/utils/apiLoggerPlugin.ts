import { ApolloServerPlugin } from '@apollo/server';
import { apiLogger, errorLogger } from './logger';
import { GraphQLContext } from '../types/graphqlContextTypes';

export const apiLoggerPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    const startTime = Date.now();

    return {
      async willSendResponse(requestContext) {
        const { request, response, errors, contextValue } = requestContext;
        const duration = Date.now() - startTime;
        
        const operationName = contextValue._operationName || request.operationName || null;
        const operationType = contextValue._operationType || 
          (request.query?.includes('mutation') ? 'mutation' :
           request.query?.includes('subscription') ? 'subscription' : 'query');
        
        const userId = contextValue._isPublic 
          ? null 
          : (contextValue.user?.id || null);

        if (errors && errors.length > 0) {
          apiLogger.graphql(
            operationName,
            operationType,
            userId,
            duration,
            [...errors]
          );

          errors.forEach((error) => {
            errorLogger.error(
              `GraphQL Error: ${operationName || 'Unknown'}`,
              error,
              {
                operationName,
                operationType,
                userId,
                duration: `${duration}ms`,
                path: error.path,
                extensions: error.extensions,
              }
            );
          });
        } else {
          apiLogger.graphql(
            operationName,
            operationType,
            userId,
            duration,
            undefined
          );
        }
      },

      async didEncounterErrors(requestContext) {
        const { errors, request, contextValue } = requestContext;
        const operationName = contextValue._operationName || request.operationName || null;
        const userId = contextValue._isPublic 
          ? null 
          : (contextValue.user?.id || null);

        errors.forEach((error) => {
          errorLogger.error(
            `GraphQL Error: ${operationName || 'Unknown'}`,
            error,
            {
              operationName,
              userId,
              path: error.path,
              extensions: error.extensions,
            }
          );
        });
      },
    };
  },
};

