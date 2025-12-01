import { MutationResolvers } from "../../../generated/graphql";
import { GraphQLError } from "graphql";
import { prisma } from "../../../utils/prisma";
import { generateOTP } from "../../../utils/otp";
import { OTPType } from "@prisma/client";
import { sendEmail } from "../../../utils/mailer";
import { 
  generateVerificationEmail, 
  generatePasswordResetEmail 
} from "../../../utils/emailTemplates";
import { checkUserBan } from "../../../utils/banCheck";
import { requestOTPInputSchema } from "../../../validation/authValidation";
import { RequestOTPInput } from "../../../types/authTypes";
import { validateInput } from "../../../validation/joiErrorFormatter";

export const requestOTP: MutationResolvers["requestOTP"] = async (
  root,
  args,
  context
) => {
  const validatedInput = validateInput<RequestOTPInput>(requestOTPInputSchema, args.input);
  const { email, type } = validatedInput;
  
  const otpType = type;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new GraphQLError('Account not found', {
      extensions: { code: 'NOT_FOUND' },
    });
  }

  if (user.isBanned) {
    const banStatus = await checkUserBan(prisma, user);
    throw new GraphQLError(banStatus.message, {
      extensions: { code: 'FORBIDDEN',
        isPermanent: banStatus.isPermanent,
        bannedUntil: banStatus.bannedUntil?.toISOString(),
        bannedReason: banStatus.bannedReason,
        minutesRemaining: banStatus.minutesRemaining,
      },
    });
  }

  if (otpType === OTPType.EMAIL_VERIFICATION) {
    if (user.isVerified) {
      throw new GraphQLError('Email is already verified', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }

  if (otpType === OTPType.PASSWORD_RESET) {
    if (!user.password) {
      throw new GraphQLError('Password reset is not available for accounts signed in with Google', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }

  const expiresInMinutes = 15;
  const otpCode = await generateOTP(user.id, otpType, expiresInMinutes);

  let emailContent;
  switch (otpType) {
    case OTPType.EMAIL_VERIFICATION:
      emailContent = generateVerificationEmail({
        name: user.name,
        verificationCode: otpCode,
      });
      break;

    case OTPType.PASSWORD_RESET:
      emailContent = generatePasswordResetEmail({
        name: user.name,
        resetCode: otpCode,
        expiresInMinutes,
      });
      break;

    case OTPType.TWO_FACTOR_AUTH:
    case OTPType.LOGIN_VERIFICATION:
      emailContent = generateVerificationEmail({
        name: user.name,
        verificationCode: otpCode,
      });
      emailContent.subject = otpType === OTPType.TWO_FACTOR_AUTH 
        ? 'Two-Factor Authentication Code'
        : 'Login Verification Code';
      break;

    default:
      throw new GraphQLError('Invalid OTP type', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
  }

   sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
  });

  return {
    message: 'An OTP code has been sent to your email address.',
    expiresInMinutes,
  };
};

