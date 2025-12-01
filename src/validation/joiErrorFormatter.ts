import { GraphQLError } from "graphql";
import Joi, { ValidationErrorItem } from "joi";

export function validateInput<T>(
    schema: Joi.ObjectSchema<T>,
    data: unknown,
    errorCode: string = 'BAD_USER_INPUT'
  ): T {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
  
    if (error) {
      const errorMessage = error.details
        .map((detail: ValidationErrorItem) => detail.message)
        .join(', ');
      
      throw new GraphQLError(errorMessage, {
        extensions: { code: errorCode },
      });
    }
  
    return value;
  }
  
  