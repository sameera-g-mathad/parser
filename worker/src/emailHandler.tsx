import { redisClient, redisSub } from './db';
import { transporter } from './transporter';
import { getTemplate } from './getTemplate';
import { Email } from './templates';


/**
 * This file will be responsible for handling emails.
 * @param to Email recipient.
 * @param template A string template/html file used for sending the email.
 * @param subject Title of the email.
 * @returns void.
 */
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



// Listen to 'signup' event.
redisSub.subscribe('signup', async (channel, _message) => {
  // Get the details from the redis client.
  const data = await redisClient.hGetAll(channel);
  // check if the key is present in the db.
  if (Object.keys(data).length > 0) {
    const { email, firstName, lastName } = data;

    // token is assumed to be present at index 2
    // ex: user:token:<actual_token>
    const verificationId = channel.split(':')[2]
    // Get the template for user signup.
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
    // send email. By default redis returns string | null for keys.
    // Forcing variable, that the email will be string.
    sendEmail(email!, template, 'Welcome to Parser🎉');
  }
  else {
    console.log('Error: No data in redis while sending email to verify signup.')
  }
});

// This listner if for sending email for resetting passwords
redisSub.subscribe('forgotPassword', async (channel, _message) => {
  // Get the details from the redis client.
  const data = await redisClient.hGetAll(channel);
  // check if the key is present in the db.
  if (Object.keys(data).length > 0) {
    const { email, firstName, lastName } = data;
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
  } else {
    console.log('Error: No data in redis while sending email to reset password.')
  }
})