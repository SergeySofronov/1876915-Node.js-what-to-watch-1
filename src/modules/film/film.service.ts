import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import CreateFilmDto from './dto/create-film.dto.js';
import EditFilmDto from './dto/edit-film.dto.js';
import { DEFAULT_FILM_COUNT, DEFAULT_FILM_SKIP_COUNT } from './film.constant.js';

@injectable()
class FilmService implements FilmServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FilmModel) private readonly filmModel: ModelType<FilmEntity>,
  ) { }

  public async create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>> {
    const result = await this.filmModel.create(dto);
    this.logger.info(`New film created: ${dto.title}`);

    return result;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.filmModel.exists({ _id: documentId })) !== null;
  }

  public async findByTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOne({ title: filmTitle }).exec();
  }

  public async findById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findById(filmId).populate('userId').exec();
  }

  public async findByGenre(genre: string, countToFetch: number, countToSkip = DEFAULT_FILM_SKIP_COUNT): Promise<DocumentType<FilmEntity>[] | null> {
    return this.filmModel.find({ genre }).skip(countToSkip).limit(countToFetch).sort('-publicationDate').populate('userId').exec();
  }

  public async findAll(countToFetch?: number): Promise<DocumentType<FilmEntity>[] | null> {
    const limit = countToFetch ?? DEFAULT_FILM_COUNT;
    return this.filmModel.find().limit(limit).sort('-publicationDate').populate('userId').exec();
  }

  public async deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndDelete(filmId).exec();
  }

  public async editById(filmId: string, dto: EditFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, dto, { new: true }).populate('userId').exec();
  }

  public async replaceById(filmId: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findOneAndReplace({ id: filmId }, dto, { new: true }).populate('userId').exec();
  }

  public async incCommentCount(filmId: string, filmRating: number): Promise<DocumentType<FilmEntity> | null> {
    return this.filmModel.findByIdAndUpdate(filmId, { '$inc': { commentsCount: 1 }, rating: filmRating }, { new: true }).exec();
  }

  public async getFavoriteFilms(userId: string): Promise<DocumentType<FilmEntity>[] | null> {
    return await this.filmModel.aggregate([
      {
        $lookup: {
          from: 'favorites',
          let: { filmId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$filmId', '$$filmId'] },
                    { $eq: [{ $toString: '$userId' }, userId] },
                  ]
                }
              }
            }
          ],
          as: 'favorites'
        }
      },
      {
        $addFields: {
          _id: '$filmId',
          isFavorite: { $gt: [{ $size: '$favorites' }, 0] }
        },
      },
      {
        $match: {
          $expr: {
            $eq: ['$isFavorite', true]
          }
        }
      },
      { $unset: 'favorites' },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      },
      {
        $unwind: '$userId'
      }
    ]).exec();
  }
}

export default FilmService;
