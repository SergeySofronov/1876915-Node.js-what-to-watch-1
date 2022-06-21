import { User } from './user.type';
import { Comment } from './comment.type';
import { FilmGenreType } from './film-genre.enum';

type Film = {
  title: string;
  description: string;
  publicationDate: string;
  genre: FilmGenreType;
  released: string;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starring: string[];
  director: string;
  runtime: number;
  commentsCount: number;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  comments: Comment[];
  user: User;
}

export { type Film };
