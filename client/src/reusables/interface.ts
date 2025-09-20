import * as RootInterface from '@/interface';

type InputType = 'email' | 'password' | 'text';
export type alertType = 'alert-success' | 'alert-danger' | 'alert-info';

export interface alertInterface extends RootInterface.className {
  message: string;
  className: alertType;
}

export interface buttonInterface extends RootInterface.className {
  callback: (event?: any) => void | Promise<void>;
}

export interface fileInterface extends RootInterface.className {
  accept: string;
  callback: (file: FileList) => void;
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

export interface textBoxInterface extends RootInterface.className {
  placeholder: string;
  onSubmit: (query: string) => void;
}
