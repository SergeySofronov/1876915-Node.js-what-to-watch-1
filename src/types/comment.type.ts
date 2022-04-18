import { User } from './user.type';

type Comment = {
  comment: string;
  rating: number;
  date: string;
  user: User;
}

export { type Comment };
