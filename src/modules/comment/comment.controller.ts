import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { EntityFilter } from '../../types/entity-filter.type.js';
import { RequestQuery } from '../../types/request-query.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import CommentDto from './dto/comment.dto.js';
import Controller from '../../common/controller/controller.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import ValidateDtoMiddleware from '../../middlewares/validate-dto.middleware.js';
import ValidateObjectIdMiddleware from '../../middlewares/validate-objectid.middleware.js';
import PrivateRouteMiddleware from '../../middlewares/private-route.middleware.js';
import DocumentExistsMiddleware from '../../middlewares/document-exists.middleware.js';

type ParamsGetFilm = {
  filmId: string;
}

@injectable()
class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/:filmId', method: HttpMethod.Post, handler: this.createComment, middlewares: [new ValidateObjectIdMiddleware('filmId'), new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateCommentDto), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] });
    this.addRoute({ path: '/:filmId', method: HttpMethod.Get, handler: this.fetchComments, middlewares: [new ValidateObjectIdMiddleware('filmId'), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] });
  }

  public async fetchComments(
    { params, query }: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const comments = await this.commentService.findByFilmId(params.filmId, query.limit);
    this.ok(res, fillDTO(CommentDto, comments, { userFilter: EntityFilter.USER_FOR_COMMENT }));
  }

  public async createComment(
    { body, params, user: { userId } }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, CreateCommentDto>,
    res: Response): Promise<void> {
    const filmId = params.filmId;
    const comment = await this.commentService.create({ ...body, filmId, userId });
    const filmRating = await this.commentService.getFilmRating(filmId);
    await this.filmService.incCommentCount(filmId, filmRating);
    this.created(res, fillDTO(CommentDto, comment, { userFilter: EntityFilter.USER_FOR_COMMENT }));
  }
}

export default CommentController;
