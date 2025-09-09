import React from 'react';
import { render } from '@react-email/components';

export const getTemplate = async (
  component: React.ReactElement
): Promise<string> => {
  // sends a string equivalent html by taking
  // in a react component.
  return await render(component);
};
