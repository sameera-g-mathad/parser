import React from 'react';
import { render } from '@react-email/components';
import { Email } from '.';


/**
 * Returns a string template given the react component.
 * @param firstName First name of the user.
 * @param lastName Last name of the user.
 * @param preview Preview of the email that appears on the inbox.
 * @param mainText Main text to be sent to the user that serves as the email purpose.
 * @param extLink Link to send the user to.
 * @param linkText Text on the link (signup, reset password..)
 * @param color color of the template.
 * @returns 
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
