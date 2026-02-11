import React from 'react';
import { Body, Container, Html, Head, Hr, Link, Preview, Section, Text, Img, } from '@react-email/components';
import { styles } from './styles';
// import fs from 'fs'
// A react component for creating a welcome 
// email to the users.
interface emailInterface {
  firstName: string,
  lastName: string,
  preview: string,
  mainText: string,
  extLink: string,
  linkText: string,
  color: string,
}

// embed the image inside the email.
// const img = "data:image/png;base64," + fs.readFileSync(`${__dirname}/../../public/logo.png`, 'base64')

/**
 * A react component that is used to create a email template for signUp and resetpassword.
 * @param firstName firstName of the user.
 * @param lastName  lastName of the user.
 * @param preview Preview to display on the email banner in the user's inbox.
 * @param mainText Main content of the email.
 * @param extLink Link external to the worker. This can be either verifyUser or resetPassword page of the parser website.
 * @param linkText A text to be displayed on the link/button of the email.
 * @param color Color to use in the email background and button.
 * @returns A JSX element that is used as an email template.
 */
export const Email: React.FC<emailInterface> = ({ firstName, lastName, preview, mainText, extLink, linkText, color }) => {
  return (
    <Html>
      <Head />
      <Body style={styles.bodyStyle}>
        <Preview>{preview}</Preview>
        <Container>
          <Section style={{ ...styles.logoStyle, backgroundColor: color }}>
            <Img
              src="https://i.imgur.com/i51x1gd.png"
              alt='Parser'
              width={100}
              height={100}
            />
          </Section>
          <Hr />
          <Text style={styles.nameStyle}>
            Hi {firstName} {lastName},
          </Text>
          <Text>
            {mainText}
          </Text>

          <Link href={extLink}>
            <Text style={{ ...styles.verificationButton, backgroundColor: color }}>
              {linkText}
            </Text>
          </Link>

          <Text>
            If you didn’t sign up for Parser, you can safely ignore this email.
          </Text>

          <Text>
            Cheers,<br />
            Sameer Gururaj Mathad
          </Text>
        </Container>
      </Body>
    </Html>
  );
};


Email.displayName = 'Signup'