import type { alertMsgInterface, ErrorHandler } from '@/interface';

/**
 * A common method to handle errors. Has a single
 * method for now, i.e withErrorHandler and returns this
 * method.
 * @returns
 */
export const useErrorHandler = (): ErrorHandler => {
  /**
   *
   * @param callback A fucnction meant to fetch some data from the server. Needs to return a Rensponse object.
   * @param setAlertMsg Method to set the alert on screen.
   * @param redirectOnSuccess By default is null. If the user needs to be redirected based on the page they are on, if the request was a success.
   * @param redirectOnError Same as above. Only when the redirection is when there is an error.
   * @returns A function wrapped around a try catch block
   * @returns Promise<void>
   */
  const withErrorHandler = <T extends any[]>(
    callback: (...args: T) => Promise<Response | void>,
    setAlertMsg?: (_alertMsg: alertMsgInterface) => void,
    redirectOnSuccess: ((args: any) => void) | null = null,
    redirectOnError: ((args: any) => void) | null = null
  ): ((...args: T) => Promise<void | any>) => {
    // Returns a function wrapped around a try catch to
    // handle errors properly.
    return async (...args: T) => {
      try {
        // get the response from the server.
        const response = await callback(...args);
        if (response instanceof Response) {
          // Response can be void type aswell.
          const data = await response.json();

          // If the status is in range >= 400, it means the
          // request was either rejected or internal server error.
          if (response.status >= 400) throw Error(data.message);

          // Alert the user for successful event.
          if (setAlertMsg)
            setAlertMsg({
              type: 'alert-success',
              message: data.message,
              status: true,
              id: Date.now(),
            });
          if (redirectOnSuccess) await redirectOnSuccess(args);
          return data;
        }
      } catch (error: unknown) {
        // If the redirect function is specified.
        if (redirectOnError) {
          await redirectOnError(args);
        }
        // errors from the server if needs to be alerted.
        let message =
          (error as Error).message || 'Something went wrong, Try again later.';
        if (setAlertMsg)
          return setAlertMsg({
            type: 'alert-danger',
            message,
            status: true,
            id: Date.now(),
          });
      }
    };
  };
  return { withErrorHandler };
};
