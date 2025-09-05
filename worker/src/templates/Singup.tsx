import React from 'react';
import { Html, Button, render } from '@react-email/components';

// A react component for creating a welcome 
// email to the users.
export const Signup: React.FC = () => {
  return (
    <Html>
      <Button>Welcome to Parser!</Button>
    </Html>
  );
};



Signup.displayName = 'Signup'