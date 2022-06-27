import { injectable } from 'inversify';
import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { RouteInterface } from '../../types/route.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { ControllerInterface } from './controller.interface';
import { ConfigInterface } from '../config/config.interface';
import { StatusCodes } from 'http-status-codes';
import { UnknownObject } from '../../types/unknown-object.type';
import { getFullServerPath, transformObject } from '../../utils/common.js';
import { STATIC_RESOURCE_FIELDS } from '../../app/application.constant.js';

@injectable()
abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    this._router[route.method](route.path, [...middlewares ?? [], routeHandler]);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: UnknownObject): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownObject);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}

export default Controller;
