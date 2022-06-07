import mongoose from 'mongoose';
import HttpError from '../common/errors/http-error.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../types/middleware.interface';

class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private param: string) { }

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (mongoose.isValidObjectId(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}

export { ValidateObjectIdMiddleware };
