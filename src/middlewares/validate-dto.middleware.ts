import { NextFunction, Request, Response } from 'express';
import { ClassConstructor } from 'class-transformer/types/interfaces/class-constructor.type.js';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { MiddlewareInterface } from '../types/middleware.interface';
import ValidationError from '../common/errors/validation-error.js';
import { transformErrors } from '../utils/common.js';

class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) { }

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance, { validationError: { target: false }, whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: \u00AB${path}\u00BB`, transformErrors(errors));
    }

    next();
  }
}

export default ValidateDtoMiddleware;
