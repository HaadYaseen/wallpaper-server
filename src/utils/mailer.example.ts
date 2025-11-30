import {
  sendEmail,
  sendTextEmail,
  sendHtmlEmail,
  sendEmailWithFallback,
  verifyConnection,
} from './mailer';
import {
  generateVerificationEmail,
  generatePasswordResetEmail,
  generateWelcomeEmail,
  generateBanNotificationEmail,
  generateLoginAttemptEmail,
} from './emailTemplates';

// Example 1: Send a simple text email
export async function exampleSendTextEmail() {
  const result = await sendTextEmail(
    'user@example.com',
    'Hello from Wallpapers App',
    'This is a plain text email message.'
  );

  if (result.success) {
    console.log('Email sent! Message ID:', result.messageId);
  } else {
    console.error('Failed to send email:', result.error);
  }
}

// Example 2: Send an HTML email
export async function exampleSendHtmlEmail() {
  const html = `
    <h1>Welcome!</h1>
    <p>Thank you for joining our platform.</p>
    <a href="https://example.com/login">Log in here</a>
  `;

  const result = await sendHtmlEmail(
    'user@example.com',
    'Welcome to Wallpapers App',
    html
  );

  if (result.success) {
    console.log('HTML email sent!');
  }
}

// Example 3: Send email with both HTML and text fallback
export async function exampleSendEmailWithFallback() {
  const html = '<h1>Hello</h1><p>This is HTML content.</p>';
  const text = 'Hello\n\nThis is plain text content.';

  const result = await sendEmailWithFallback(
    'user@example.com',
    'Email with Fallback',
    html,
    text
  );
}

// Example 4: Send email with attachments
export async function exampleSendEmailWithAttachments() {
  const result = await sendEmail({
    to: 'user@example.com',
    subject: 'Email with Attachment',
    html: '<p>Please find the attachment.</p>',
    attachments: [
      {
        filename: 'document.pdf',
        path: '/path/to/document.pdf', // or use 'content' for buffer
      },
    ],
  });
}

// Example 5: Send to multiple recipients
export async function exampleSendToMultiple() {
  const result = await sendEmail({
    to: ['user1@example.com', 'user2@example.com'],
    cc: 'manager@example.com',
    subject: 'Team Update',
    html: '<p>This is a team update.</p>',
  });
}

// Example 6: Use email templates - Verification email
export async function exampleVerificationEmail() {
  const emailData = generateVerificationEmail({
    name: 'John Doe',
    verificationCode: '123456',
  });

  const result = await sendEmail({
    to: 'user@example.com',
    ...emailData,
  });
}

// Example 7: Use email templates - Password reset
export async function examplePasswordResetEmail() {
  const emailData = generatePasswordResetEmail({
    name: 'John Doe',
    resetCode: '789012',
    expiresInMinutes: 60,
  });

  const result = await sendEmail({
    to: 'user@example.com',
    ...emailData,
  });
}

// Example 8: Use email templates - Welcome email
export async function exampleWelcomeEmail() {
  const emailData = generateWelcomeEmail({
    name: 'John Doe',
    loginLink: 'https://example.com/login',
  });

  const result = await sendEmail({
    to: 'user@example.com',
    ...emailData,
  });
}

// Example 9: Use email templates - Ban notification
export async function exampleBanNotificationEmail() {
  const emailData = generateBanNotificationEmail({
    name: 'John Doe',
    reason: 'Violation of terms of service',
    isPermanent: false,
    bannedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  const result = await sendEmail({
    to: 'user@example.com',
    ...emailData,
  });
}

// Example 10: Use email templates - Login attempt notification
export async function exampleLoginAttemptEmail() {
  const emailData = generateLoginAttemptEmail(
    'John Doe',
    '192.168.1.1',
    'Chrome on Windows',
    false // failed attempt
  );

  const result = await sendEmail({
    to: 'user@example.com',
    ...emailData,
  });
}

// Example 11: Verify SMTP connection (useful for health checks)
export async function exampleVerifyConnection() {
  const isConnected = await verifyConnection();
  if (isConnected) {
    console.log('SMTP connection is working!');
  } else {
    console.error('SMTP connection failed!');
  }
}

// Example 12: Advanced email with all options
export async function exampleAdvancedEmail() {
  const result = await sendEmail({
    to: 'user@example.com',
    subject: 'Advanced Email',
    html: '<h1>Advanced Email</h1><p>This email has all options.</p>',
    text: 'Advanced Email\n\nThis email has all options.',
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
    replyTo: 'noreply@example.com',
    attachments: [
      {
        filename: 'image.png',
        path: '/path/to/image.png',
        contentType: 'image/png',
      },
    ],
  });
}

