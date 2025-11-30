import { MutationResolvers, UserGraphqlType } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { hashPassword } from "../../../utils/auth";
import { prisma } from "../../../utils/context";
import { generateOTP, generateUniqueUsername } from "./utils";
import { OTPType } from "@prisma/client";
import { sendEmail } from "../../../utils/mailer";
import { generateVerificationEmail } from "../../../utils/emailTemplates";

export const signUp: MutationResolvers["signUp"] = async (
  root,
  args,
  context
) => {
  const { email, password, name, username, avatar } = args.input;

  // Validate input
  if (!email || !password || !name || !username) {
    throw new GraphQLError('All fields are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  if (password.length < 8) {
    throw new GraphQLError('Password must be at least 8 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  
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
  
  // Check if user already exists
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

  // Generate unique username if needed
  const uniqueUsername = await generateUniqueUsername(username);

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username: uniqueUsername,
      avatar: avatar || null,
      isVerified: false,
    },
  });

  const verificationCode = await generateOTP(user.id, OTPType.EMAIL_VERIFICATION, 15);

  const emailContent = generateVerificationEmail({
    name: user.name,
    verificationCode,
  });

  await sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  return {
    user: user as unknown as UserGraphqlType,
    message: 'Account created successfully. Please check your email for the verification code.',
  };
};

