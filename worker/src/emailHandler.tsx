import { redisClient } from './db';
import { transporter } from './transporter';
import { getTemplate } from './getTemplate';
import { Signup } from './templates';

// This file will be responsible for handling emails.
const sendEmail = async (to: string, template: string): Promise<void> => {
  let mailOptions = {
    from: `"Sameer Gururaj Mathad @Parser" <${process.env.FROM}>`,
    to,
    subject: 'Welcome to Parser🎉',
    html: template,
  };
  await transporter.sendMail(mailOptions);
  console.log('Email sent!!')
};

const redisSub = redisClient.duplicate();
redisSub.connect();

redisSub.subscribe('signup', async (channel, message) => {
  const { email, firstName, lastName } = await redisClient.hGetAll(channel);
  const verificationId = channel.split(':')[2]
  const template = await getTemplate(<Signup firstName={firstName} lastName={lastName} projectName='Parser' verificationId={verificationId} />);
  sendEmail(email!, template);
});
