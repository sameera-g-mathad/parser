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
    setAlertMsg: (_alertMsg: alertMsgInterface) => void,
    redirectOnSuccess: (() => void) | null = null,
    redirectOnError: (() => void) | null = null
  ): ((...args: T) => Promise<void>) => {
    // Returns a function wrapped around a try catch to
    // handle errors properly.
    return async (...args: T) => {
      try {
        // get the response from the server.
        const response = await callback(...args);
        // Response can be void type aswell.
        if (response instanceof Response) {
          const data = await response.json();

          // If the status is in range >= 400, it means the
          // request was either rejected or internal server error.
          if (response.status >= 400) throw Error(data.message);

          // Alert the user that email is successfully sent.
          setAlertMsg({
            type: 'alert-success',
            message: data.message,
            status: true,
          });
          if (redirectOnSuccess) redirectOnSuccess();
        }
      } catch (error: unknown) {
        // If the redirect function is specified.
        if (redirectOnError) {
          redirectOnError();
        }
        // errors could be user requesting email frequently without waiting or checking inbox.
        let message =
          (error as Error).message || 'Something went wrong, Try again later.';
        return setAlertMsg({
          type: 'alert-danger',
          message,
          status: true,
        });
      }
    };
  };
  return { withErrorHandler };
};
