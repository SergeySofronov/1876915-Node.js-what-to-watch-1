import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../types/middleware.interface';

class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) { }

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance, { validationError: { target: false }, whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(errors);
      return;
    }

    next();
  }
}

export default ValidateDtoMiddleware;
