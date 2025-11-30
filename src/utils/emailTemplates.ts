import { generateHtmlTemplate } from './mailer';

export interface EmailVerificationData {
  name: string;
  verificationCode: string;
}

export interface PasswordResetData {
  name: string;
  resetCode: string;
  expiresInMinutes?: number;
}

export interface WelcomeEmailData {
  name: string;
  loginLink?: string;
}

export interface BanNotificationData {
  name: string;
  reason: string;
  isPermanent: boolean;
  bannedUntil?: Date;
}

export function generateVerificationEmail(data: EmailVerificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Verify Your Email Address';
  const content = `
    <p>Hi ${data.name},</p>
    <p>Thank you for signing up! Please verify your email address using the verification code below:</p>
    <p style="margin: 20px 0; text-align: center;">
      <span style="background-color: #4CAF50; color: white; padding: 15px 30px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
        ${data.verificationCode}
      </span>
    </p>
    <p>This code will expire in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  const text = `
Hi ${data.name},

Thank you for signing up! Please verify your email address using this verification code:

${data.verificationCode}

This code will expire in 15 minutes.

If you didn't create an account, please ignore this email.
  `.trim();

  return {
    subject,
    html: generateHtmlTemplate('Verify Your Email', content),
    text,
  };
}

export function generatePasswordResetEmail(data: PasswordResetData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Reset Your Password';
  const expiresText = data.expiresInMinutes
    ? `This link will expire in ${data.expiresInMinutes} minutes.`
    : 'This link will expire in 1 hour.';

  const content = `
    <p>Hi ${data.name},</p>
    <p>We received a request to reset your password. Use the reset code below:</p>
    <p style="margin: 20px 0; text-align: center;">
      <span style="background-color: #2196F3; color: white; padding: 15px 30px; border-radius: 5px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
        ${data.resetCode}
      </span>
    </p>
    <p>${expiresText}</p>
    <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
  `;

  const text = `
Hi ${data.name},

We received a request to reset your password. Use this reset code:

${data.resetCode}

${expiresText}

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
  `.trim();

  return {
    subject,
    html: generateHtmlTemplate('Reset Your Password', content),
    text,
  };
}

export function generateWelcomeEmail(data: WelcomeEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Welcome to Wallpapers App!';
  const content = `
    <p>Hi ${data.name},</p>
    <p>Welcome to Wallpapers App! We're excited to have you on board.</p>
    <p>Get started by exploring our collection of amazing wallpapers and participating in contests.</p>
    ${data.loginLink ? `<p><a href="${data.loginLink}">Log in to your account</a></p>` : ''}
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Happy wallpaper hunting!</p>
  `;

  const text = `
Hi ${data.name},

Welcome to Wallpapers App! We're excited to have you on board.

Get started by exploring our collection of amazing wallpapers and participating in contests.

${data.loginLink ? `Log in: ${data.loginLink}` : ''}

If you have any questions, feel free to reach out to our support team.

Happy wallpaper hunting!
  `.trim();

  return {
    subject,
    html: generateHtmlTemplate('Welcome!', content),
    text,
  };
}

export function generateBanNotificationEmail(data: BanNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'Account Status Update';
  const banDuration = data.isPermanent
    ? 'permanently'
    : data.bannedUntil
    ? `until ${new Date(data.bannedUntil).toLocaleDateString()}`
    : 'temporarily';

  const content = `
    <p>Hi ${data.name},</p>
    <p>Your account has been ${banDuration} banned.</p>
    <p><strong>Reason:</strong> ${data.reason}</strong></p>
    ${!data.isPermanent && data.bannedUntil
      ? `<p>Your account will be automatically reinstated on ${new Date(data.bannedUntil).toLocaleDateString()}.</p>`
      : ''}
    ${data.isPermanent
      ? '<p>If you believe this is an error, please contact our support team to appeal this decision.</p>'
      : ''}
  `;

  const text = `
Hi ${data.name},

Your account has been ${banDuration} banned.

Reason: ${data.reason}

${!data.isPermanent && data.bannedUntil
  ? `Your account will be automatically reinstated on ${new Date(data.bannedUntil).toLocaleDateString()}.`
  : ''}
${data.isPermanent
  ? 'If you believe this is an error, please contact our support team to appeal this decision.'
  : ''}
  `.trim();

  return {
    subject,
    html: generateHtmlTemplate('Account Status Update', content),
    text,
  };
}

export function generateLoginAttemptEmail(
  name: string,
  ipAddress: string,
  deviceInfo?: string,
  isSuccessful: boolean = false
): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = isSuccessful
    ? 'New Login Detected'
    : 'Failed Login Attempt';
  const statusText = isSuccessful
    ? 'A successful login was detected from a new device or location.'
    : 'A failed login attempt was detected on your account.';

  const content = `
    <p>Hi ${name},</p>
    <p>${statusText}</p>
    <ul>
      <li><strong>IP Address:</strong> ${ipAddress}</li>
      ${deviceInfo ? `<li><strong>Device:</strong> ${deviceInfo}</li>` : ''}
      <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    ${!isSuccessful
      ? '<p>If this wasn\'t you, please change your password immediately and contact support.</p>'
      : '<p>If this wasn\'t you, please secure your account immediately.</p>'}
  `;

  const text = `
Hi ${name},

${statusText}

IP Address: ${ipAddress}
${deviceInfo ? `Device: ${deviceInfo}` : ''}
Time: ${new Date().toLocaleString()}

${!isSuccessful
  ? "If this wasn't you, please change your password immediately and contact support."
  : "If this wasn't you, please secure your account immediately."}
  `.trim();

  return {
    subject,
    html: generateHtmlTemplate(subject, content),
    text,
  };
}

