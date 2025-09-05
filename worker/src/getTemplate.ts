import React from 'react';
import { render } from '@react-email/components';

export const getTemplate = async (
  component: React.ReactElement
): Promise<string> => {
  return await render(component);
};
