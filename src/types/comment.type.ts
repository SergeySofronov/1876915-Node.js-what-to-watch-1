import { User } from './user.type';

type Comment = {
  comment: string;
  rating: number;
  date: string;
  author: User;
}

export { type Comment };
