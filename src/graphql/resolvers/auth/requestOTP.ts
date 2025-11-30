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

export const requestOTP: MutationResolvers["requestOTP"] = async (
  root,
  args,
  context
) => {
  const { email, type } = args.input;

  if (!email || !type) {
    throw new GraphQLError('Email and OTP type are required', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      message: 'If an account exists with this email, an OTP code has been sent.',
      expiresInMinutes: 15,
    };
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

  if (type === OTPType.EMAIL_VERIFICATION) {
    if (user.isVerified) {
      throw new GraphQLError('Email is already verified', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }

  if (type === OTPType.PASSWORD_RESET) {
    if (!user.password) {
      throw new GraphQLError('Password reset is not available for accounts signed in with Google', {
        extensions: { code: 'BAD_USER_INPUT' },
      });
    }
  }

  const expiresInMinutes = 15;
  const otpCode = await generateOTP(user.id, type, expiresInMinutes);

  let emailContent;
  switch (type) {
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
      emailContent.subject = type === OTPType.TWO_FACTOR_AUTH 
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

