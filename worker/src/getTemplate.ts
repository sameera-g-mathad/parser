import React from 'react';
import { render } from '@react-email/components';

/**
 * Returns a string template given the react component.
 * @param component A react component to be converted into string.
 * @returns string.
 */
export const getTemplate = async (
  component: React.ReactElement
): Promise<string> => {
  // sends a string equivalent html by taking
  // in a react component.
  return await render(component);
};
