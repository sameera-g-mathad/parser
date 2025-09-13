import { CSSProperties } from 'react';

export const styles: { [key: string]: CSSProperties } = {
  // Css Properties.
  bodyStyle: {
    fontSize: '15px',
  },

  logoStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
  },

  nameStyle: {
    textTransform: 'capitalize',
  },

  verificationButton: {
    textAlign: 'center',
    padding: '10px',
    border: '1px solid white',
    borderRadius: '10px',
    fontWeight: 'bold',
    color: 'white',
  },
};
