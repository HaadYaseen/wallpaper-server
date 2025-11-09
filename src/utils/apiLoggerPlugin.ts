import { ApolloServerPlugin } from '@apollo/server';
import { apiLogger, errorLogger } from './logger';
import { GraphQLContext } from './context';

/**
 * Apollo Server plugin for logging GraphQL operations and errors
 * Note: API requests are logged in context.ts where we have user ID
 * This plugin handles response logging and error logging
 */
export const apiLoggerPlugin: ApolloServerPlugin<GraphQLContext> = {
  async requestDidStart() {
    const startTime = Date.now();

    return {
      async willSendResponse(requestContext) {
        const { request, response, errors, contextValue } = requestContext;
        const duration = Date.now() - startTime;
        
        // Use operation info from context (set during context creation)
        const operationName = contextValue._operationName || request.operationName || null;
        const operationType = contextValue._operationType || 
          (request.query?.includes('mutation') ? 'mutation' :
           request.query?.includes('subscription') ? 'subscription' : 'query');
        
        // Get user ID - null for public operations or unauthenticated users
        const userId = contextValue._isPublic 
          ? null 
          : (contextValue.user?.id || null);

        // Log the response with duration and errors
        if (errors && errors.length > 0) {
          apiLogger.graphql(
            operationName,
            operationType,
            userId,
            duration,
            [...errors]
          );

          // Log errors to error.log
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
          // Log successful response
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

        // Log errors to error.log
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

