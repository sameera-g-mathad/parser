import React from 'react';
import { render } from '@react-email/components';
import { Email } from '.';
/**
 * Returns a string template given the react component.
 * @param component A react component to be converted into string.
 * @returns string.
 */
export const getTemplate = async (
  firstName: string, lastName: string, preview: string, mainText: string, extLink: string, linkText: string, color: string
): Promise<string> => {
  // sends a string equivalent html by taking
  // in a react component.
  return await render(<Email
    firstName={firstName}
    lastName={lastName}
    preview={preview}
    mainText={mainText}
    extLink={extLink}
    linkText={linkText}
    color={color}
  />);
};
