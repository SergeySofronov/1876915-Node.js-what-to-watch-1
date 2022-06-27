import { NextFunction, Request, Response } from 'express';
import { DocumentOwnerInterface, MiddlewareInterface } from '../types/middleware.interface';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';

class DocumentOwnerMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentOwnerInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) { }

  public async execute({ params, user: { userId } }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.isOwner(documentId, userId)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `You are not allowed to make changes to ${this.entityName} with ${documentId}.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}

export default DocumentOwnerMiddleware;
