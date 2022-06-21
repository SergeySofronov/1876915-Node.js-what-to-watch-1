import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { FilmServiceInterface } from '../film/film-service.interface.js';
import { FavoritesServiceInterface } from './favorites-service.interface.js';
import ValidateObjectIdMiddleware from '../../middlewares/validate-objectid.middleware.js';
import DocumentExistsMiddleware from '../../middlewares/document-exists.middleware.js';
import PrivateRouteMiddleware from '../../middlewares/private-route.middleware.js';
import Controller from '../../common/controller/controller.js';
import ValidateParamIsBooleanMiddleware from '../../middlewares/validate-param-boolean.middleware.js';
import FilmDto from '../film/dto/film.dto.js';

type ParamsFavorites = {
  filmId: string;
  isFavorite: boolean;
}

@injectable()
class FavoritesController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FavoritesServiceInterface) private readonly favoritesService: FavoritesServiceInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.fetchFavoriteFilms, middlewares: [new PrivateRouteMiddleware()] }); // Получение списка фильмов «К просмотру»
    this.addRoute({ path: '/:filmId/:isFavorite', method: HttpMethod.Post, handler: this.setFavoriteFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new ValidateParamIsBooleanMiddleware('isFavorite'), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId'), new PrivateRouteMiddleware()] }); // Добавление фильма в список «К просмотру»
  }

  public async setFavoriteFilm(
    { params, user }: Request<core.ParamsDictionary | ParamsFavorites>,
    res: Response): Promise<void> {
    const filmId = params.filmId;
    const userId = user.id;
    const isFavorite = Boolean(Number(params.isFavorite));
    const film = await this.filmService.findById(filmId);
    await this.favoritesService.setFavoriteFilm({ filmId, userId }, isFavorite);

    this.ok(res, fillDTO(FilmDto, { ...film?.toObject(), isFavorite }));
  }

  public async fetchFavoriteFilms(
    { user }: Request,
    res: Response): Promise<void> {
    const films = await this.filmService.getFavoriteFilms(user.id);

    this.ok(res, fillDTO(FilmDto, films));
  }
}

export default FavoritesController;
