import Joi from 'joi';
import { ContestStatus, ContestType, CreateContestInput, UpdateContestInput } from '../generated/graphql';

export const createContestSchema = Joi.object<CreateContestInput>({
  startTime: Joi.date()
    .required()
    .messages({
      'date.base': 'Start time must be a valid date',
      'any.required': 'Start time is required',
    }),
  durationInDays: Joi.number()
    .integer()
    .min(1)
    .max(365)
    .required()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be a whole number of days',
      'number.min': 'Duration must be at least 1 day',
      'number.max': 'Duration cannot exceed 365 days',
      'any.required': 'Duration is required',
    }),
  contestStatus: Joi.string()
    .valid(...Object.values(ContestStatus))
    .required()
    .messages({
      'any.only': `Contest status must be one of: ${Object.values(ContestStatus).join(', ')}`,
      'any.required': 'Contest status is required',
    }),
  contestType: Joi.string()
    .valid(...Object.values(ContestType))
    .required()
    .messages({
      'any.only': `Contest type must be one of: ${Object.values(ContestType).join(', ')}`,
      'any.required': 'Contest type is required',
    }),
  totalPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Total prize must be a number',
      'number.integer': 'Total prize must be a whole number',
      'number.min': 'Total prize cannot be negative',
      'any.required': 'Total prize is required',
    }),
  firstPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'First prize must be a number',
      'number.integer': 'First prize must be a whole number',
      'number.min': 'First prize cannot be negative',
      'any.required': 'First prize is required',
    }),
  secondPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Second prize must be a number',
      'number.integer': 'Second prize must be a whole number',
      'number.min': 'Second prize cannot be negative',
      'any.required': 'Second prize is required',
    }),
  thirdPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Third prize must be a number',
      'number.integer': 'Third prize must be a whole number',
      'number.min': 'Third prize cannot be negative',
      'any.required': 'Third prize is required',
    }),
}).custom((value, helpers) => {
  const { firstPrize, secondPrize, thirdPrize, totalPrize } = value;
  const prizeSum = firstPrize + secondPrize + thirdPrize;
  
  if (prizeSum > totalPrize) {
    return helpers.error('any.custom', {
      message: `Sum of prizes (${prizeSum}) cannot exceed total prize (${totalPrize})`,
    });
  }
  
  if (firstPrize < secondPrize || secondPrize < thirdPrize) {
    return helpers.error('any.custom', {
      message: 'Prizes must be in descending order (first >= second >= third)',
    });
  }
  
  return value;
});

export const updateContestSchema = Joi.object<UpdateContestInput>({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'ID must be a string',
      'any.required': 'ID is required',
    }),
  startTime: Joi.date()
    .required()
    .messages({
      'date.base': 'Start time must be a valid date',
      'any.required': 'Start time is required',
    }),
  endTime: Joi.date()
    .required()
    .greater(Joi.ref('startTime'))
    .messages({
      'date.base': 'End time must be a valid date',
      'any.required': 'End time is required',
      'date.greater': 'End time must be after start time',
    }),
  contestStatus: Joi.string()
    .valid(...Object.values(ContestStatus))
    .required()
    .messages({
      'any.only': `Contest status must be one of: ${Object.values(ContestStatus).join(', ')}`,
      'any.required': 'Contest status is required',
    }),
  contestType: Joi.string()
    .valid(...Object.values(ContestType))
    .required()
    .messages({
      'any.only': `Contest type must be one of: ${Object.values(ContestType).join(', ')}`,
      'any.required': 'Contest type is required',
    }),
  totalPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Total prize must be a number',
      'number.integer': 'Total prize must be a whole number',
      'number.min': 'Total prize cannot be negative',
      'any.required': 'Total prize is required',
    }),
  firstPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'First prize must be a number',
      'number.integer': 'First prize must be a whole number',
      'number.min': 'First prize cannot be negative',
      'any.required': 'First prize is required',
    }),
  secondPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Second prize must be a number',
      'number.integer': 'Second prize must be a whole number',
      'number.min': 'Second prize cannot be negative',
      'any.required': 'Second prize is required',
    }),
  thirdPrize: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Third prize must be a number',
      'number.integer': 'Third prize must be a whole number',
      'number.min': 'Third prize cannot be negative',
      'any.required': 'Third prize is required',
    }),
}).custom((value, helpers) => {
  const { firstPrize, secondPrize, thirdPrize, totalPrize } = value;
  const prizeSum = firstPrize + secondPrize + thirdPrize;
  
  if (prizeSum > totalPrize) {
    return helpers.error('any.custom', {
      message: `Sum of prizes (${prizeSum}) cannot exceed total prize (${totalPrize})`,
    });
  }
  
  if (firstPrize < secondPrize || secondPrize < thirdPrize) {
    return helpers.error('any.custom', {
      message: 'Prizes must be in descending order (first >= second >= third)',
    });
  }
  
  return value;
});
