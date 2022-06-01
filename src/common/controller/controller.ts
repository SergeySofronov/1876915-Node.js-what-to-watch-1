import { injectable } from 'inversify';
import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { RouteInterface } from '../../types/route.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { ControllerInterface } from './controller.interface';

@injectable()
abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(protected readonly logger: LoggerInterface) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    this._router[route.method](route.path, asyncHandler(route.handler.bind(this)));
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }


}

export default Controller;
