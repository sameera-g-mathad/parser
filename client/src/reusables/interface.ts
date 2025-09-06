import * as RootInterface from './../interface';

type InputType = 'email' | 'password' | 'text';
export type alertType = 'alert-success' | 'alert-danger';

export interface alertInterface extends RootInterface.className {
  message: string;
  className: alertType;
}

export interface buttonInterface extends RootInterface.className {
  callback: () => void;
}

export interface inputGroupInterface extends RootInterface.className {
  label: string;
}
export interface inputInterface extends RootInterface.className {
  type: InputType;
  placeholder: string;
  value: string;
  callback: (item: string) => void;
}
