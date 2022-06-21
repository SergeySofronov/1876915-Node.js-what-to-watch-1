import { NextFunction, Request, Response } from 'express';
import { DocumentExistsInterface, MiddlewareInterface } from '../types/middleware.interface';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';

class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) { }

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}

export default DocumentExistsMiddleware;
