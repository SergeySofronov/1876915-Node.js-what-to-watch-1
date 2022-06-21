declare namespace Express {
  export interface Request {
    user: {
      id: string;
      avatar:string;
      email: string;
      name: string;
      token: string;
    }
  }
}
