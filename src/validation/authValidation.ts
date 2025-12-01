import Joi from 'joi';
import { OTPType } from '@prisma/client';
import { GoogleAuthInput, LoginInput, SignUpInput, VerifyEmailInput, RequestOTPInput, RefreshTokenInput } from '../types/authTypes';

export const signUpInputSchema = Joi.object<SignUpInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.max': 'Password must not exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one capital letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters and spaces',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name must not exceed 50 characters',
      'any.required': 'Name is required',
    }),
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters and numbers (no spaces)',
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters',
      'string.max': 'Username must not exceed 30 characters',
      'any.required': 'Username is required',
    }),
  avatar: Joi.string()
    .uri()
    .allow(null, '')
    .optional()
    .messages({
      'string.uri': 'Avatar must be a valid URL',
    }),
});

export const loginInputSchema = Joi.object<LoginInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
});

export const googleAuthInputSchema = Joi.object<GoogleAuthInput>({
  idToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Google ID token is required',
      'any.required': 'Google ID token is required',
    }),
});

export const verifyEmailInputSchema = Joi.object<VerifyEmailInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  code: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Verification code is required',
      'string.length': 'Verification code must be 6 digits',
      'string.pattern.base': 'Verification code must contain only numbers',
      'any.required': 'Verification code is required',
    }),
});

export const requestOTPInputSchema = Joi.object<RequestOTPInput>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  type: Joi.string()
    .valid(...Object.values(OTPType))
    .required()
    .messages({
      'any.only': 'Invalid OTP type',
      'any.required': 'OTP type is required',
    }),
});

export const refreshTokenInputSchema = Joi.object<RefreshTokenInput>({
  refreshToken: Joi.string()
    .required()
    .messages({
      'string.empty': 'Refresh token is required',
      'any.required': 'Refresh token is required',
    }),
});
