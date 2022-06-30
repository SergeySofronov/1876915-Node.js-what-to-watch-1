import { DEFAULT_RATING } from '../const';
import CreateFilmDto from '../dto/film/create-film.dto';
import LoginUserDto from '../dto/user/login-user.dto';
import NewUserDto from '../dto/user/new-user.dto';
import { NewFilm } from '../types/new-film';
import { NewUser } from '../types/new-user';

const adaptNewUserToServer = (user: NewUser): NewUserDto => ({
  name: user.name,
  email: user.email,
  password: user.password
});

const adaptLoginUserToServer = (user: NewUser): LoginUserDto => ({
  email: user.email,
  password: user.password
});

const adaptNewFilmToServer = (film: NewFilm): CreateFilmDto => ({
  title: film.name,
  description: film.description,
  publicationDate: new Date().toISOString(),
  genre: film.genre,
  released: String(film.released),
  rating: DEFAULT_RATING,
  previewVideoLink: film.previewVideoLink,
  videoLink: film.videoLink,
  starring: film.starring,
  director: film.director,
  runtime: film.runTime,
  posterImage: film.posterImage,
  backgroundImage: film.backgroundImage,
  backgroundColor: film.backgroundColor
});

const adaptAvatarToServer = (file: File) => {
  const formData = new FormData();
  formData.set('avatar', file);

  return formData;
};

export {
  adaptNewFilmToServer,
  adaptNewUserToServer,
  adaptLoginUserToServer,
  adaptAvatarToServer
};

