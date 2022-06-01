import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import CreateFilmDto from './dto/create-film.dto.js';

@injectable()
class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: ModelType<FilmEntity>
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.title}`);

    return result;
  }

  public async findByTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({ title: filmTitle }).exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).exec();
  }

  public async findAll(): Promise<DocumentType<FilmEntity>[]> {
    return this.filmModel.find().exec();
  }
}

export default FilmService;
