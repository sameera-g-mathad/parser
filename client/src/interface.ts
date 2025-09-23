import type { alertType } from '@/reusables/interface';

export interface alertMsgInterface {
  type: alertType;
  message: string;
  status: boolean;
  id: number;
}

// Return type of useValidation.
export type Validation = {
  isEmailValid: (email: string) => boolean;
  isPasswordValid: (password: string) => boolean;
  isPasswordSame: (password: string, confirmPassword: string) => boolean;
};

// Type can ve any object. Useful for signup and signin flows.
// Ex: SignUp: {email:'', password: '', confirmPassword: '', firstName: '', lastName: ''}
// Ex: SignIn: {email: '', password: ''}
export type ReducerType<T> = T & { alertMsg: alertMsgInterface };

// Return type of useAuthReducer.
// Returns a state, setFieldWithValue, and setAlertMsg.
export type Reducer<T> = {
  state: ReducerType<T>;
  setFieldWithValue: (field: string, value: string | number) => void;
  setAlertMsg: (alertMsg: alertMsgInterface) => void;
};

// Type of the method useErrorHandler returns.
// withErrorHandler has a callback, setAlertMsg and
// redirectOnError and redirectOnSuccess parameters to be passed.
export type ErrorHandler = {
  withErrorHandler: <T extends any[]>(
    callback: (...args: T) => Promise<Response | void>,
    setAlertMsg?: (_alertMsg: alertMsgInterface) => void,
    redirectOnSuccess?: ((args: any) => void) | null,
    redirectOnError?: ((args: any) => void) | null
  ) => (...args: T) => Promise<void | any>;
};

// Used in ChatWindow and Message.tsx
export type chat =
  | {
      type: 'human';
      message: string;
    }
  | {
      type: 'ai';
      message: string;
      pageNumbers?: number[];
    };

export interface className {
  className?: string;
}

// Common Interfaces used by Components.
export interface authFormInterface {
  title: string;
  description: string;
}

export interface signUpInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  alertMsg: alertMsgInterface;
  confirmPassword: string;
}

export interface signInInterface {
  email: string;
  password: string;
  alertMsg: alertMsgInterface;
}

export interface forgotPasswordInterface {
  email: string;
  alertMsg: alertMsgInterface;
}

export interface uploadRowInterface {
  id: string;
  rowNum: number;
  original_name: string;
  status: 'active' | 'processing';
  updated_at: string;
  created_at: string;
  deleting?: boolean;
  callback: (...args: any) => void;
}

export interface messageInterface {
  chat: chat;
  streaming: boolean;
  onPageClick: (page: number) => void;
}

export interface chatWindowInterface {
  onPageClick: (page: number) => void;
  history: chat[];
}

export interface pdfWindowInterface {
  url: string;
  moveToPage: number;
}

export interface documentCardInterface extends className {
  title: string;
  value: number;
}
