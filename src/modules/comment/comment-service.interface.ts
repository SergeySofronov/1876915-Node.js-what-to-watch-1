import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { CommentEntity } from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByFilmId(filmId: string, countToFetch?: number): Promise<DocumentType<CommentEntity>[] | null>;
  findOrCreate(filmId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  getFilmRating(filmId: string): Promise<number>;
  deleteByFilmId(filmId: string): Promise<number | null>;
}

export { CommentServiceInterface };
