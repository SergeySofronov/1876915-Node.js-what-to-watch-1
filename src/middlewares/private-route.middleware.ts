import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../types/middleware.interface';
import HttpError from '../common/errors/http-error.js';

class PrivateRouteMiddleware implements MiddlewareInterface {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}

export default PrivateRouteMiddleware;
