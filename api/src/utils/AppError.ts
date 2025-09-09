/**
 * A general class that extends Error to handle
 * errors. As of now, only has statusCode extra attribute.
 * Might add new attributes/methods in future.
 */
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
