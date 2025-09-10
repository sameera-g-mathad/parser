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
  setFieldWithValue: (field: string, value: string) => void;
  setAlertMsg: (alertMsg: alertMsgInterface) => void;
};

// Type of the method useErrorHandler returns.
// withErrorHandler has a callback, setAlertMsg and
// redirectOnError and redirectOnSuccess parameters to be passed.
export type ErrorHandler = {
  withErrorHandler: (
    callback: () => Promise<Response | void>,
    setAlertMsg: (_alertMsg: alertMsgInterface) => void,
    redirectOnSuccess?: (() => void) | null,
    redirectOnError?: (() => void) | null
  ) => () => Promise<void>;
};

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
