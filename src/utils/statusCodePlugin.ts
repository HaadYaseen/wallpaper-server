import { ApolloServerPlugin } from "@apollo/server";

const ERROR_CODE_TO_STATUS: Record<string, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  BAD_USER_INPUT: 400,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  UNEXPECTED_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const statusCodePlugin: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse(requestContext) {
        const { response, errors } = requestContext;
        
        if (errors && errors.length > 0) {
          // Priority order: 401 > 403 > 400 > 404 > 409 > 422 > 500 > 503
          const priorityOrder = [401, 403, 400, 404, 409, 422, 500, 503];
          let statusCode: number | null = null;
          let highestPriority = Infinity;
          
          for (const error of errors) {
            const errorCode = error.extensions?.code as string | undefined;
            
            if (errorCode && ERROR_CODE_TO_STATUS[errorCode]) {
              const mappedStatus = ERROR_CODE_TO_STATUS[errorCode];
              const priority = priorityOrder.indexOf(mappedStatus);
              
              // Use the error with the highest priority (lowest index)
              if (priority !== -1 && priority < highestPriority) {
                statusCode = mappedStatus;
                highestPriority = priority;
              }
            }
          }
          
          if (statusCode !== null) {
            response.http.status = statusCode;
          }
        } else {
          const request = requestContext.request;
          if (request.query && request.query.includes('mutation')) {
            response.http.status = 200;
          }
        }
      },
    };
  },
};