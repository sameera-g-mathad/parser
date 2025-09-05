import { redisClient } from './db';
import { transporter } from './transporter';
import { getTemplate } from './getTemplate';
import { Signup } from './templates';

// This file will be responsible for handling emails.
const sendEmail = async (to: string, template: string): Promise<void> => {
  let mailOptions = {
    from: process.env.FROM,
    to,
    subject: 'Welcome to Parser!',
    html: template,
  };
  await transporter.sendMail(mailOptions);
};


const redisSub = redisClient.duplicate();
redisSub.connect();

redisSub.subscribe('signup', async (channel, message) => {
  const email = await redisClient.hGet(channel, 'email');
  const template = await getTemplate(<Signup />);
  sendEmail(email!, template);
});
