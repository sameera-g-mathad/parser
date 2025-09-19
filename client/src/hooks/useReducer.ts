import { useReducer } from 'react';
import type { alertMsgInterface, Reducer, ReducerType } from '@/interface';

// file to generailize the use of useReducer.

// Two actions, either to set the field (from T) or alertMsg
// to display alerts on screen.
type payloadActions =
  | { action: 'setField'; field: string; value: string | number }
  | { action: 'setAlertMsg'; value: alertMsgInterface };

/**
 * Reducer function to handle state.
 * @param state  An object with the initial object passed as well as the alert object.
 * @param payload Will be either to set the field of the initial state passed or alert object.
 * @returns void
 */
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

/**
 * Auth reducer hook that is exported to use. Returns
 * state, setFieldWithValue, setAlertMsg methods.
 * @param initialState Object that the client passes initially.
 * @returns Reducer
 * @example SignUp: {email:'', password: '', confirmPassword: '', firstName: '', lastName: ''}.
 * @example SignIn: {email: '', password: ''}
 */
export const useCustomReducer = <T extends object>(
  initialState: T
): Reducer<T> => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    alertMsg: {
      type: 'alert-success',
      status: false,
      message: '',
      id: Date.now(),
    },
  } as ReducerType<T>);

  /**
   * Method to set field - value
   * @param field  Field present in the state.
   * @param value  Value to set the field in the state.
   * @returns void
   * @example email: 'example@test.com'
   */
  const setFieldWithValue = (field: string, value: string | number) => {
    dispatch({ action: 'setField', field, value });
  };

  //
  /**
   * Method to set alert message.
   * @param alertMsg - Object to set the alert banner, with alertMsgInterface.
   * @returns void
   */
  const setAlertMsg = (alertMsg: alertMsgInterface) => {
    dispatch({ action: 'setAlertMsg', value: alertMsg });
  };

  // return state, and methods to use the hook.
  return {
    state,
    setFieldWithValue,
    setAlertMsg,
  };
};
