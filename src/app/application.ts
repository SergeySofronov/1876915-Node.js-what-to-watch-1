import cors from 'cors';
import { inject, injectable } from 'inversify';
import express, { Express, Request, Response } from 'express';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { Component } from '../types/component.type.js';
import { getURI } from '../utils/db.js';
import { getFullServerPath, getNotFoundPage } from '../utils/common.js';
import { StatusCodes } from 'http-status-codes';
import AuthenticateMiddleware from '../middlewares/authenticate.middleware.js';

@injectable()
class Application {
  private expressApp: Express;
  private authenticationMiddleware: AuthenticateMiddleware;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.FilmController) private filmController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
    @inject(Component.FavoritesController) private favoritesController: ControllerInterface
  ) {
    this.expressApp = express();
    this.authenticationMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
  }

  private defaultRouteHandler(req: Request, res: Response) {
    res.type('text/html').status(StatusCodes.NOT_FOUND).send(getNotFoundPage(req.path));
  }

  public registerRoutes() {
    this.expressApp.use('/', this.filmController.router);
    this.expressApp.use('/', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
    this.expressApp.use('/favorite', this.favoritesController.router);
    this.expressApp.route('*').all(this.defaultRouteHandler);
  }

  public registerMiddlewares() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.expressApp.use('/static', express.static(this.config.get('STATIC_DIRECTORY_PATH')));
    this.expressApp.use(this.authenticationMiddleware.execute.bind(this.authenticationMiddleware));
    this.expressApp.use(cors());
  }

  public registerExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`Get value from env $SALT: ${this.config.get('SALT')}`);
    this.logger.info(`Get value from env $DB_USER: ${this.config.get('DB_USER')}`);
    this.logger.info(`Get value from env $DB_PASSWORD: ${this.config.get('DB_PASSWORD')}`);
    this.logger.info(`Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`Get value from env $DB_PORT: ${this.config.get('DB_PORT')}`);
    this.logger.info(`Get value from env $DB_NAME: ${this.config.get('DB_NAME')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.logger.info(uri);

    await this.databaseClient.connect(uri);

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'), () => this.logger.info(`Server started on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`));
  }
}

export default Application;
