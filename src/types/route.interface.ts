import { HttpMethod } from './http-method.enum.js';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';

interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: MiddlewareInterface[];
}

export { RouteInterface };
