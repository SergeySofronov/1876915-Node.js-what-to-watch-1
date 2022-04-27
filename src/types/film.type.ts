import { Comment } from './comment.type';
import { User } from './user.type';

type Film = {
  title: string;
  description: string;
  publicationDate: string;
  genre: string;
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
