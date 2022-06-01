import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { FilmEntity } from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';

interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null>;
  findAll(): Promise<DocumentType<FilmEntity>[]>;
}

export { FilmServiceInterface };
