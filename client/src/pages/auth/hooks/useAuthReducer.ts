import { useReducer } from 'react';
import type { alertMsgInterface } from '../interface';

type ReducerType<T> = T & { alertMsg: alertMsgInterface };
type payloadActions =
  | { action: 'setField'; field: string; value: string }
  | { action: 'setAlertMsg'; value: alertMsgInterface };

const reducer = <T>(state: ReducerType<T>, payload: payloadActions) => {
  switch (payload.action) {
    case 'setField':
      return { ...state, [payload.field]: payload.value };
    case 'setAlertMsg':
      return { ...state, alertMsg: payload.value };
    default:
      return state;
  }
};

export const useAuthReducer = <T extends object>(initialState: T) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    alertMsg: {
      type: 'alert-success',
      status: false,
      message: '',
      id: Date.now(),
    },
  } as ReducerType<T>);

  const setFieldWithValue = (field: string, value: string) => {
    dispatch({ action: 'setField', field, value });
  };

  const setAlertMsg = (alertMsg: alertMsgInterface) => {
    dispatch({ action: 'setAlertMsg', value: alertMsg });
  };

  return {
    state,
    setFieldWithValue,
    setAlertMsg,
  };
};
