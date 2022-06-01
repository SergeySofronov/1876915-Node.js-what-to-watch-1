import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { StatusCodes } from 'http-status-codes';
import { LoggerInterface } from '../../common/logger/logger.interface';
import Controller from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';


@injectable()
class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    // @inject(Component.UserServiceInterface) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/:id', method: HttpMethod.Post, handler: this.createComment });
    this.addRoute({ path: '/:id', method: HttpMethod.Get, handler: this.fetchComments });
  }

  public async fetchComments(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'UserController');
  }

  public async createComment(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'UserController');
  }
}

export default CommentController;
