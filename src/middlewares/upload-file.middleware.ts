import path from 'path';
import mime from 'mime';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../types/middleware.interface';
import { FileExtensions } from '../types/file-extensions.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';


class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) { }

  public execute(req: Request, res: Response, next: NextFunction): void {
    const storage = multer.diskStorage({
      destination: this.uploadDirectory,

      filename: (_req, file, cb) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        cb(extension ? null : new HttpError(
          StatusCodes.BAD_REQUEST,
          'Wrong content-type. For example: \u00ABimage/jpeg\u00BB',
          'UploadFileMiddleware'
        ), `${filename}.${extension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, FileExtensions.includes(`${extension}`));
      }
    }).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
export default UploadFileMiddleware;
