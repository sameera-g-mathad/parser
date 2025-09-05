import { createTransport, TransportOptions } from 'nodemailer';

// A nodemailer transporter with required config.
export const transporter = createTransport({
  host: process.env.SMTP, // Outlook SMTP host
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
} as TransportOptions);
