import React, { CSSProperties } from 'react';
import { Body, Container, Html, Head, Hr, Link, Preview, Section, Text, Img, } from '@react-email/components';
import fs from 'fs'
// A react component for creating a welcome 
// email to the users.
interface emailInterface {
  firstName: string,
  lastName: string,
  preview: string,
  mainText: string,
  extLink: string,
  linkText: string
}

// embed the image inside the email.
const img = "data:image/png;base64," + fs.readFileSync(`${__dirname}/../../public/logo.png`, 'base64')

/**
 * A react component that is used to create a email template for signUp and resetpassword.
 * @param firstName firstName of the user.
 * @param lastName  lastName of the user.
 * @param preview Preview to display on the email banner in the user's inbox.
 * @param mainText Main content of the email.
 * @param extLink Link external to the worker. This can be either verifyUser or resetPassword page of the parser website.
 * @param linkText A text to be displayed on the link/button of the email.
 * @returns A JSX element that is used as an email template.
 */
export const Email: React.FC<emailInterface> = ({ firstName, lastName, preview, mainText, extLink, linkText }) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Preview>{preview}</Preview>
        <Container>
          <Section style={logoStyle}>
            <Img
              src={img}
              alt='Parser'
              width={100}
              height={100}
            />
          </Section>
          <Hr />
          <Text style={nameStyle}>
            Hi {firstName} {lastName},
          </Text>
          <Text>
            {mainText}
          </Text>

          <Link href={extLink}>
            <Text style={verificationButton}>
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

// Css Properties.
const bodyStyle: CSSProperties = {
  fontSize: '15px',
}

const logoStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: "10px"
}

const nameStyle: CSSProperties = {
  textTransform: 'capitalize',
}

const verificationButton: CSSProperties = {
  textAlign: 'center',
  padding: "10px",
  border: "1px solid white",
  borderRadius: '10px',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#554C91'
}


Email.displayName = 'Signup'