import * as jose from 'jose';
import { NextFunction, Request, Response } from 'express';
import { createSecretKey } from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from '../types/middleware.interface';
import HttpError from '../common/errors/http-error.js';

class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) { }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jose.jwtVerify(token, createSecretKey(this.jwtSecret, 'utf-8'));
      req.user = {
        email: payload.email as string,
        userId: payload.userId as string,
        avatar: payload.avatar as string,
        name: payload.name as string,
        token: token
      };

      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}

export default AuthenticateMiddleware;
