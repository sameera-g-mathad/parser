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

/**
 * This file will be responsible for handling emails.
 * @param to Email recipient.
 * @param template A string template/html file used for sending the email.
 * @param subject Title of the email.
 * @returns void.
 */
export const sendEmail = async (
  to: string,
  template: string,
  subject: string
): Promise<void> => {
  let mailOptions = {
    from: `"Sameer Gururaj Mathad @Parser" <${process.env.FROM}>`,
    to,
    subject,
    html: template,
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent!!');
};
