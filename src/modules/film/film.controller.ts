import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { fillDTO } from '../../utils/common.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { FilmServiceInterface } from './film-service.interface';
import { StatusCodes } from 'http-status-codes';
import { RequestQuery } from '../../types/request-query.type.js';
import { DEFAULT_FILM_COUNT, SIMILAR_FILM_COUNT, SIMILAR_FILM_SKIP_COUNT } from './film.constant.js';
import ValidateDtoMiddleware from '../../middlewares/validate-dto.middleware.js';
import ValidateObjectIdMiddleware from '../../middlewares/validate-objectid.middleware.js';
import Controller from '../../common/controller/controller.js';
import ShortedFilmDto from './dto/shorted-film.dto.js';
import CreateFilmDto from './dto/create-film.dto.js';
import DetailedFilmDto from './dto/detailed-film.dto.js';
import HttpError from '../../common/errors/http-error.js';
import EditFilmDto from './dto/edit-film.dto.js';
import * as core from 'express-serve-static-core';

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
    this.addRoute({ path: '/films', method: HttpMethod.Post, handler: this.createFilm, middlewares: [new ValidateDtoMiddleware(CreateFilmDto)] }); // Добавить новый фильм
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Get, handler: this.fetchFilm, middlewares: [new ValidateObjectIdMiddleware('filmId')] }); // Получение детальной информации по фильму
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Patch, handler: this.editFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new ValidateDtoMiddleware(EditFilmDto)] }); // Частичное редактирование карточки фильма
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Put, handler: this.replaceFilm, middlewares: [new ValidateObjectIdMiddleware('filmId'), new ValidateDtoMiddleware(CreateFilmDto)] }); // Полное редактирование карточки фильма
    this.addRoute({ path: '/films/:filmId', method: HttpMethod.Delete, handler: this.deleteFilm, middlewares: [new ValidateObjectIdMiddleware('filmId')] }); // Удаление фильма
    this.addRoute({ path: '/films/:filmId/similar', method: HttpMethod.Get, handler: this.fetchSimilarFilms, middlewares: [new ValidateObjectIdMiddleware('filmId')] }); // Получение списка похожих фильмов
    this.addRoute({ path: '/films/genre/:genre', method: HttpMethod.Get, handler: this.fetchFilmsByGenre }); // Получение списка похожих фильмов
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.fetchPromoFilm }); // Получение промо-фильма
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.fetchFavoriteFilms }); // Получение списка фильмов «К просмотру»
    this.addRoute({ path: '/favorite/:filmId/:isFavorite', method: HttpMethod.Post, handler: this.setFavoriteFilm, middlewares: [new ValidateObjectIdMiddleware('filmId')] }); // Получение списка фильмов «К просмотру»
  }

  public async setFavoriteFilm(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async fetchFavoriteFilms(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
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
    this.ok(res, fillDTO(ShortedFilmDto, films));
  }

  public async fetchSimilarFilms(
    { params, query }: Request<core.ParamsDictionary | ParamsGetFilm, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const { filmId } = params;
    const film = await this.filmService.findById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }
    const limit = query.limit ?? SIMILAR_FILM_COUNT;
    const films = await this.filmService.findByGenre(film.genre, limit, SIMILAR_FILM_SKIP_COUNT);
    this.ok(res, fillDTO(ShortedFilmDto, films));
  }

  public async deleteFilm(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const film = await this.filmService.deleteById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }
    this.noContent(res, film);
  }

  public async replaceFilm(
    { body, params }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, CreateFilmDto>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const editedFilm = await this.filmService.replaceById(filmId, body);

    if (!editedFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }
    this.ok(res, fillDTO(DetailedFilmDto, editedFilm));
  }

  public async editFilm(
    { body, params }: Request<core.ParamsDictionary | ParamsGetFilm, Record<string, unknown>, EditFilmDto>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const editedFilm = await this.filmService.editById(filmId, body);

    if (!editedFilm) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }
    this.ok(res, fillDTO(DetailedFilmDto, editedFilm));
  }

  public async fetchFilm(
    { params }: Request<core.ParamsDictionary | ParamsGetFilm>,
    res: Response
  ): Promise<void> {
    const { filmId } = params;
    const film = await this.filmService.findById(filmId);

    if (!film) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Film with id ${filmId} not found.`,
        'FilmController'
      );
    }
    this.ok(res, fillDTO(DetailedFilmDto, film));
  }

  public async fetchFilms(
    { query }: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response): Promise<void> {
    const films = await this.filmService.findAll(query.limit);
    this.ok(res, fillDTO(ShortedFilmDto, films));
  }

  public async createFilm(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const newFilm = await this.filmService.create(body);
    const savedFilm = await this.filmService.findById(newFilm.id);
    this.created(res, fillDTO(DetailedFilmDto, savedFilm));
  }
}

export default FilmController;
