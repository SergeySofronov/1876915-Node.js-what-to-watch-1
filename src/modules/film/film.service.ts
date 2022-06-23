import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { FilmServiceInterface } from './film-service.interface.js';
import { FilmEntity } from './film.entity.js';
import { Component } from '../../types/component.type.js';
import CreateFilmDto from './dto/create-film.dto.js';
import EditFilmDto from './dto/edit-film.dto.js';
import { DEFAULT_FILM_COUNT } from './film.constant.js';
import { mongoose } from '@typegoose/typegoose';

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

  public async findById(userId: string, filmId: string): Promise<DocumentType<FilmEntity> | null> {
    const films = await this.find(userId, 1, { '_id': new mongoose.Types.ObjectId(filmId) });
    return films ? films[0] : null;
  }

  public async findByGenre(userId: string, genre: string, countToFetch: number): Promise<DocumentType<FilmEntity>[] | null> {
    return this.find(userId, countToFetch, { genre });
  }

  public async find(userId = '', countToFetch?: number, searchOptions?: Record<string | number, unknown>, isFavoriteOnly = false): Promise<DocumentType<FilmEntity>[] | null> {
    const limit = countToFetch ?? DEFAULT_FILM_COUNT;
    const match = searchOptions ? Object.entries(searchOptions).map(([key, value]) => ({ $eq: [`$${key}`, value] })) : {};

    return this.filmModel.aggregate([
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
        $match: { $expr: { $and: match } }
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          isFavorite: { $gt: [{ $size: '$favorites' }, 0] }
        }
      },
      {
        $match: {
          $expr: {
            $switch: {
              branches: [
                {
                  case: { $eq: [isFavoriteOnly, false] },
                  then: true
                }
              ], default: { $eq: ['$isFavorite', true] }
            }
          }
        }
      },
      { $unset: 'favorites' },
      { $limit: limit },
      { $sort: { publicationDate: -1 } },
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
}

export default FilmService;
