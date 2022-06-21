import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { FilmServiceInterface } from './film-service.interface';
import { StatusCodes } from 'http-status-codes';
import { RequestQuery } from '../../types/request-query.type.js';
import { EntityFilter } from '../../types/entity-filter.type.js';
import { DEFAULT_FILM_COUNT, SIMILAR_FILM_COUNT, SIMILAR_FILM_SKIP_COUNT } from './film.constant.js';
import ValidateDtoMiddleware from '../../middlewares/validate-dto.middleware.js';
import ValidateObjectIdMiddleware from '../../middlewares/validate-objectid.middleware.js';
import DocumentExistsMiddleware from '../../middlewares/document-exists.middleware.js';
import PrivateRouteMiddleware from '../../middlewares/private-route.middleware.js';
import Controller from '../../common/controller/controller.js';
import CreateFilmDto from './dto/create-film.dto.js';
import HttpError from '../../common/errors/http-error.js';
import EditFilmDto from './dto/edit-film.dto.js';
import FilmDto from './dto/film.dto.js';

type ParamsGetFilm = {
  filmId: string;
  genre: string;
}

@injectable()
class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/films', method: HttpMethod.Get, handler: this.fetchFilms });  // Получить список всех фильмов
    this.addRoute({ path: '/films', method: HttpMethod.Post, handler: this.createFilm, middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateFilmDto)] }); // Добавить новый фильм
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Get, handler: this.fetchFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] }); // Получение детальной информации по фильму
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Patch, handler: this.editFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new PrivateRouteMiddleware(), new ValidateDtoMiddleware(EditFilmDto), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] }); // Частичное редактирование карточки фильма
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Put, handler: this.replaceFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateFilmDto), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] }); // Полное редактирование карточки фильма
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Delete, handler: this.deleteFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new PrivateRouteMiddleware(), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] }); // Удаление фильма
    this.addRoute({ path: '/films/:filmId/similar', method: HttpMethod.Get, handler: this.fetchSimilarFilms, middlewares: [new ValidateObjectIdMiddleware('filmId'), new DocumentExistsMiddleware(this.filmService, 'Film', 'filmId')] }); // Получение списка похожих фильмов
    this.addRoute({ path: '/films/genre/:genre', method: HttpMethod.Get, handler: this.fetchFilmsByGenre }); // Получение списка похожих фильмов
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.fetchPromoFilm }); // Получение промо-фильма
  }

  public async fetchPromoFilm(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async fetchFilmsByGenre(
    { params, query }: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const limit = query.limit ?? DEFAULT_FILM_COUNT;
    const films = await this.filmService.findByGenre(params.genre, limit);
    this.ok(res, fillDTO(FilmDto, films, { filmFilter: EntityFilter.FILM_SHORT }));
  }

  public async fetchSimilarFilms(
    { params, query }: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const limit = query.limit ?? SIMILAR_FILM_COUNT;
    const film = await this.filmService.findById(params.filmId);
    if (film) {
      const films = await this.filmService.findByGenre(film.genre, limit, SIMILAR_FILM_SKIP_COUNT);
      this.ok(res, fillDTO(FilmDto, films, { filmFilter: EntityFilter.FILM_SHORT }));
    }
  }

  public async deleteFilm(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response): Promise<void> {
    const film = await this.filmService.deleteById(params.filmId);
    this.noContent(res, film);
  }

  public async replaceFilm(
    { body, params }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const editedFilm = await this.filmService.replaceById(params.filmId, body);
    this.ok(res, fillDTO(FilmDto, editedFilm));
  }

  public async editFilm(
    { body, params }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, EditFilmDto>,
    res: Response): Promise<void> {
    const editedFilm = await this.filmService.editById(params.filmId, body);
    this.ok(res, fillDTO(FilmDto, editedFilm));
  }

  public async fetchFilm(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response): Promise<void> {
    const film = await this.filmService.findById(params.filmId);
    this.ok(res, fillDTO(FilmDto, film));
  }

  public async fetchFilms(
    { query }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const films = await this.filmService.findAll(query.limit);
    this.ok(res, fillDTO(FilmDto, films, { filmFilter: EntityFilter.FILM_SHORT }));
  }

  public async createFilm(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const newFilm = await this.filmService.create(body);
    const savedFilm = await this.filmService.findById(newFilm.id);
    this.created(res, fillDTO(FilmDto, savedFilm));
  }
}

export default FilmController;
