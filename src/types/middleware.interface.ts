import { NextFunction, Request, Response } from 'express';

interface MiddlewareInterface {
  execute(req: Request, res: Response, next: NextFunction): void;
}

interface DocumentExistsInterface {
  exists(documentId: string): Promise<boolean>;
}

export { MiddlewareInterface, DocumentExistsInterface };
