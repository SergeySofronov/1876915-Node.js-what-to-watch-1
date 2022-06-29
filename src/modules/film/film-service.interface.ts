import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { FilmEntity } from './film.entity.js';
import { DocumentExistsInterface, DocumentOwnerInterface } from '../../types/middleware.interface.js';
import CreateFilmDto from './dto/create-film.dto.js';
import EditFilmDto from './dto/edit-film.dto.js';

interface FilmServiceInterface extends DocumentExistsInterface, DocumentOwnerInterface  {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(userId: string, filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByGenre(userId: string, genre: string, countToFetch: number): Promise<DocumentType<FilmEntity>[] | null>;
  findFavoriteFilms(userId: string): Promise<DocumentType<FilmEntity>[] | null>;
  find(userId: string, countToFetch?: number, searchOptions?: Record<string | number, unknown>, isFavoriteOnly?: boolean): Promise<DocumentType<FilmEntity>[] | null>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  editById(filmId: string, dto: EditFilmDto): Promise<DocumentType<FilmEntity> | null>;
  replaceById(filmId: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  incCommentCount(filmId: string, filmRating: number): Promise<DocumentType<FilmEntity> | null>;
  isOwner(userId: string, filmId: string): Promise<boolean>;
}

export { FilmServiceInterface };
