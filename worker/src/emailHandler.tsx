import { redisClient } from './db';
import { transporter } from './transporter';
import { getTemplate } from './getTemplate';
import { Email } from './templates';

// This file will be responsible for handling emails.
const sendEmail = async (to: string, template: string, subject: string): Promise<void> => {
  let mailOptions = {
    from: `"Sameer Gururaj Mathad @Parser" <${process.env.FROM}>`,
    to,
    subject,
    html: template,
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent!!')
};

const redisSub = redisClient.duplicate();
redisSub.connect();

redisSub.subscribe('signup', async (channel, _message) => {
  const { email, firstName, lastName } = await redisClient.hGetAll(channel);
  const verificationId = channel.split(':')[2]
  const template = await getTemplate(
    <Email
      firstName={firstName}
      lastName={lastName}
      preview="Let’s get started — verify your email to activate your account."
      mainText={`Thanks for signing up for Parser! We’re excited to have you on board.
            Before we get started, please verify your email to activate your account.
            
            Note: This verification link will expire in 5 minutes.`}
      extLink={`http://localhost:3050/auth/verify-user/${verificationId}`}
      linkText=' Verify My Email'
    />);
  sendEmail(email!, template, 'Welcome to Parser🎉');
});


redisSub.subscribe('forgotPassword', async (channel, _message) => {
  const { email, firstName, lastName } = await redisClient.hGetAll(channel)
  const verificationId = channel.split(':')[2]; // channel here is the  token
  const template = await getTemplate(
    <Email
      firstName={firstName}
      lastName={lastName}
      preview="Your password reset link is ready"
      mainText={`We received a request to reset your password. Click the link below to set a new password.
                Note: This password reset link will expire in 2 minutes.
                `}
      extLink={`http://localhost:3050/auth/reset-password/${verificationId}`}
      linkText=' Reset Password'
    />);
  sendEmail(email!, template, 'Reset Your Password 🔑');
})