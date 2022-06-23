declare namespace Express {
  export interface Request {
    user: {
      userId: string;
      avatar:string;
      email: string;
      name: string;
      token: string;
    }
  }
}
