import type { alertType } from '../../reusables/interface';

export interface alertMsgInterface {
  type: alertType;
  message: string;
  status: boolean;
  id: number;
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
