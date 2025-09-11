declare module Express {
  export interface Request {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
    };
  }
}
