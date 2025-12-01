import { MutationResolvers, UserResponseType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { hashPassword } from "../../../utils/auth";
import { prisma } from "../../../utils/prisma";
import { generateOTP } from "../../../utils/otp";
import { OTPType } from "@prisma/client";
import { sendEmail } from "../../../utils/mailer";
import { generateVerificationEmail } from "../../../utils/emailTemplates";
import { signUpInputSchema } from "../../../validation/authValidation";
import { validateInput } from "../../../validation/joiErrorFormatter";
import { SignUpInput } from "../../../types/authTypes";

export const signUp: MutationResolvers["signUp"] = async (
  root,
  args,
  context
) => {
  const validatedInput = validateInput<SignUpInput>(signUpInputSchema, args.input);
  const { email, password, name, username, avatar } = validatedInput;

  if (username.toLowerCase().includes('admin') || name.toLowerCase().includes('admin')) {
    throw new GraphQLError('Username and name cannot contain "admin"', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (username.toLowerCase().includes('superadmin') || name.toLowerCase().includes('superadmin')) {
    throw new GraphQLError('Username and name cannot contain "superadmin"', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new GraphQLError('User with this email or username already exists', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username,
      avatar: avatar || null,
      isVerified: false,
    },
  });

  const verificationCode = await generateOTP(user.id, OTPType.EMAIL_VERIFICATION, 15);

  const emailContent = generateVerificationEmail({
    name: user.name,
    verificationCode,
  });

   sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  return {
    user: user as UserResponseType,
    message: 'Account created successfully. Please check your email for the verification code.',
  };
};

