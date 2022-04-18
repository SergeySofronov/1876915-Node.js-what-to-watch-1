import { User } from './user.type';

type Film = {
  name: string;
  description: string;
  release: string;
  rating: number;
  previewVideoLink: string;
  videoLink: string;
  starring: string[];
  director: string;
  runTime: number;
  commentsCount: number;
  posterImage: string;
  backgroundImage: string;
  backgroundColor: string;
  user: User;
}

export { type Film };
