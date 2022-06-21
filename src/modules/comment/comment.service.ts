import { inject, injectable } from 'inversify';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import { DEFAULT_COMMENT_COUNT } from './comment.constant.js';
import mongoose from 'mongoose';

@injectable()
class CommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.CommentModel) private readonly commentModel: ModelType<CommentEntity>
  ) { }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.userId}`);

    return result.populate('userId');
  }

  public async findOrCreate(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.findOne({ filmId, comment: dto.comment }).populate('userId').exec();
    if (comment) {
      return comment;
    }

    return await this.commentModel.create(dto);
  }

  public async findByFilmId(filmId: string, countToFetch?: number): Promise<DocumentType<CommentEntity>[] | null> {
    const limit = countToFetch ?? DEFAULT_COMMENT_COUNT;
    return this.commentModel.find({ filmId }).limit(limit).sort('-date').populate('userId').exec();
  }

  public async getFilmRating(filmId: string): Promise<number> {
    const films = await this.commentModel.aggregate([
      { $match: { filmId: new mongoose.Types.ObjectId(`${filmId}`) } },
      { $group: { _id: '$filmId', averageRating: { $avg: '$rating' } } }
    ]).exec();
    const rating = films[0].averageRating ?? 0;

    return (rating % 1) ? rating.toFixed(1) : rating;
  }
}

export default CommentService;
