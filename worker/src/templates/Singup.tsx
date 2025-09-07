import React, { CSSProperties } from 'react';
import { Body, Container, Html, Head, Hr, Link, Preview, Section, Text, Img, } from '@react-email/components';
import fs from 'fs'
// A react component for creating a welcome 
// email to the users.
interface signUpInterface {
  firstName: string,
  lastName: string,
  projectName: string;
}

// embed the image inside the email.
const img = "data:image/png;base64," + fs.readFileSync(`${__dirname}/../../public/logo.png`, 'base64')
export const Signup: React.FC<signUpInterface> = ({ firstName, lastName, projectName }) => {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Preview>Let’s get started — verify your email to activate your account.</Preview>
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
            Thanks for signing up for {projectName}! We’re excited to have you on board.
            Before we get started, please verify your email to activate your account.

          </Text>

          <Link href='http://localhost:3050'>
            <Text style={verificationButton}>
              Verify My Email
            </Text>
          </Link>

          <Text>
            If you didn’t sign up for {projectName}, you can safely ignore this email.
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
  backgroundColor: 'blue'
}


Signup.displayName = 'Signup'