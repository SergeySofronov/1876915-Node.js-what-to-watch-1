import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { LoggerInterface } from '../../common/logger/logger.interface';
import { FilmServiceInterface } from './film-service.interface';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../utils/common.js';
import Controller from '../../common/controller/controller.js';
import ShortedFilmDto from './dto/shorted-film.dto.js';
import CreateFilmDto from './dto/create-film.dto.js';
import DetailedFilmDto from './dto/detailed-film.dto.js';
import HttpError from '../../common/errors/http-error.js';


@injectable()
class FilmController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.FilmServiceInterface) private readonly filmService: FilmServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for FilmController...');

    this.addRoute({ path: '/films', method: HttpMethod.Get, handler: this.fetchFilms });  // Получить список всех фильмов
    this.addRoute({ path: '/films', method: HttpMethod.Post, handler: this.createFilm }); // Добавить новый фильм
    this.addRoute({ path: '/films/:id', method: HttpMethod.Get, handler: this.fetchFilm }); // Получение детальной информации по фильму
    this.addRoute({ path: '/films/:id', method: HttpMethod.Put, handler: this.editFilm }); // Редактирование карточки фильма
    this.addRoute({ path: '/films/:id', method: HttpMethod.Delete, handler: this.deleteFilm }); // Удаление фильма
    this.addRoute({ path: '/films/:id/similar', method: HttpMethod.Get, handler: this.fetchSimilarFilms }); // Получение списка похожих фильмов
    this.addRoute({ path: '/promo', method: HttpMethod.Get, handler: this.fetchPromoFilm }); // Получение промо-фильма
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.fetchFavoriteFilms }); // Получение списка фильмов «К просмотру»
    this.addRoute({ path: '/favorite/:id/:isFavorite', method: HttpMethod.Post, handler: this.setFavoriteFilm }); // Получение списка фильмов «К просмотру»
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

  public async fetchSimilarFilms(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async deleteFilm(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async editFilm(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async fetchFilm(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'not implemented', 'FilmController');
  }

  public async fetchFilms(_req: Request, res: Response): Promise<void> {
    const films = await this.filmService.findAll();
    const filmsDTO = fillDTO(ShortedFilmDto, films);
    this.send(res, StatusCodes.OK, filmsDTO);
  }

  public async createFilm(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateFilmDto>,
    res: Response): Promise<void> {
    const film = await this.filmService.findByTitle(body.title);

    if (film) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Film with title «${body.title}» already exists.`,
        'FilmController'
      );
    }

    const newFilm = await this.filmService.create(body);
    this.send(res, StatusCodes.CREATED, fillDTO(DetailedFilmDto, newFilm));
  }
}

export default FilmController;
