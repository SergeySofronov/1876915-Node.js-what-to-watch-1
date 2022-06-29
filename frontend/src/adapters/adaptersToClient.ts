import CommentDto from '../dto/comment/comment.dto';
import FilmDto from '../dto/film/film.dto';
import LoggedUserDto from '../dto/user/logged-user.dto';
import { Film } from '../types/film';
import { Review } from '../types/review';
import { User } from '../types/user';

const adaptUserToClient =
  (user: LoggedUserDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar,
    token: user.token,
  });

const adaptFilmsToClient = (films: FilmDto[]): Film[] =>
  films
    .filter((film: FilmDto) =>
      film.user !== null,
    )
    .map((film: FilmDto) => ({
      id: film.id,
      name: film.title,
      posterImage: film.posterImage,
      backgroundImage: film.backgroundImage,
      backgroundColor: film.backgroundColor,
      videoLink: film.videoLink,
      previewVideoLink: film.previewVideoLink,
      description: film.description,
      rating: film.rating,
      director: film.director,
      starring: film.starring,
      runTime: film.runtime,
      genre: film.genre,
      released: Number(film.released),
      isFavorite: film.isFavorite,
      user: adaptUserToClient(film.user)
    }));

const adaptFilmToClient = (film: FilmDto): Film | null => film.user ? ({
  id: film.id,
  name: film.title,
  posterImage: film.posterImage,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor,
  videoLink: film.videoLink,
  previewVideoLink: film.previewVideoLink,
  description: film.description,
  rating: film.rating,
  director: film.director,
  starring: film.starring,
  runTime: film.runtime,
  genre: film.genre,
  released: Number(film.released),
  isFavorite: film.isFavorite,
  user: adaptUserToClient(film.user)
}) : null;

const adaptCommentsToClient = (comments: CommentDto[]): Review[] =>
  comments
    .filter((comment: CommentDto) =>
      comment.user !== null,
    )
    .map((comment: CommentDto) => ({
      comment: comment.comment,
      date: comment.date,
      id: comment.id,
      rating: comment.rating,
      user: {
        name: comment.user.name,
      }
    }));

export {
  adaptUserToClient,
  adaptFilmsToClient,
  adaptFilmToClient,
  adaptCommentsToClient
};
