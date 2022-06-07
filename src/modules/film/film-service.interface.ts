import { DocumentType } from '@typegoose/typegoose/lib/types.js';
import { FilmEntity } from './film.entity.js';
import CreateFilmDto from './dto/create-film.dto.js';
import EditFilmDto from './dto/edit-film.dto.js';

interface FilmServiceInterface {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByGenre(genre: string, countToFetch: number, countToSkip?: number): Promise<DocumentType<FilmEntity>[] | null>;
  findByTitle(filmTitle: string): Promise<DocumentType<FilmEntity> | null>;
  findAll(countToFetch?: number): Promise<DocumentType<FilmEntity>[] | null>;
  deleteById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  editById(filmId: string, dto: EditFilmDto): Promise<DocumentType<FilmEntity> | null>;
  replaceById(filmId: string, dto: CreateFilmDto): Promise<DocumentType<FilmEntity> | null>;
}

export { FilmServiceInterface };
