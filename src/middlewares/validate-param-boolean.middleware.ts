import HttpError from '../common/errors/http-error.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../types/middleware.interface';

class ValidateParamIsBooleanMiddleware implements MiddlewareInterface {
  constructor(private param: string) { }

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const param = params[this.param];
    if ((param === '1') || (param === '0')) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${param} is invalid, \u00AB0\u00BB or \u00AB1\u00BB expected`,
      'ValidateObjectIdMiddleware'
    );
  }
}

export default ValidateParamIsBooleanMiddleware;
