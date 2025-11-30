import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { logger } from './logger';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

const SMTP_HOST = getRequiredEnvVar('SMTP_HOST');
const SMTP_PORT = parseInt(getRequiredEnvVar('SMTP_PORT') || '587', 10);
const SMTP_USER = getRequiredEnvVar('SMTP_USER');
const SMTP_PASSWORD = getRequiredEnvVar('SMTP_PASSWORD');
const SMTP_FROM = getEnvVar('SMTP_FROM', SMTP_USER) || getRequiredEnvVar('SMTP_FROM');
const SMTP_FROM_NAME = getEnvVar('SMTP_FROM_NAME', 'Wallpapers App');

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
      // For development/testing with services like Mailtrap
      ...(process.env.NODE_ENV === 'development' && {
        tls: {
          rejectUnauthorized: false,
        },
      }),
    });

    // Verify connection in development
    if (process.env.NODE_ENV === 'development') {
      transporter.verify().catch((error) => {
        logger.error('SMTP connection verification failed', error);
      });
    }
  }
  return transporter;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
    contentType?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  try {
    const mailOptions: SendMailOptions = {
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
      bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    // Ensure at least text or html is provided
    if (!mailOptions.text && !mailOptions.html) {
      throw new Error('Either text or html content must be provided');
    }

    const info = await getTransporter().sendMail(mailOptions);

    logger.api.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to send email', error, {
      to: options.to,
      subject: options.subject,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function sendTextEmail(
  to: string | string[],
  subject: string,
  text: string,
  options?: Omit<EmailOptions, 'to' | 'subject' | 'text' | 'html'>
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject,
    text,
    ...options,
  });
}

export async function sendHtmlEmail(
  to: string | string[],
  subject: string,
  html: string,
  options?: Omit<EmailOptions, 'to' | 'subject' | 'html'>
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject,
    html,
    ...options,
  });
}

export async function sendEmailWithFallback(
  to: string | string[],
  subject: string,
  html: string,
  text: string,
  options?: Omit<EmailOptions, 'to' | 'subject' | 'html' | 'text'>
): Promise<SendEmailResult> {
  return sendEmail({
    to,
    subject,
    html,
    text,
    ...options,
  });
}

export async function verifyConnection(): Promise<boolean> {
  try {
    await getTransporter().verify();
    logger.api.info('SMTP connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP connection verification failed', error);
    return false;
  }
}

export function generateHtmlTemplate(
  title: string,
  content: string,
  footer?: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      margin-top: 0;
    }
    .content {
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <div class="content">
      ${content}
    </div>
    ${footer ? `<div class="footer">${footer}</div>` : ''}
  </div>
</body>
</html>
  `.trim();
}

