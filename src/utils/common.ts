import crypto from 'crypto';
import { Film } from '../types/film.type';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

const createFilm = (rowData: string): Film => {
  const chunk = rowData.replace('\n', '').split('\t');
  const [title,
    description,
    publicationDate,
    genre,
    released,
    rating,
    previewVideoLink,
    videoLink,
    starring,
    director,
    runtime,
    posterImage,
    backgroundImage,
    backgroundColor,
    comments,
    name,
    email,
    avatar,
    password] = chunk;

  const rawComments = comments.split('|');

  return ({
    title,
    description,
    publicationDate,
    genre,
    released,
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starring: starring.split(';'),
    director,
    runtime: Number(runtime),
    commentsCount: rawComments.length,
    posterImage,
    backgroundImage,
    backgroundColor,
    comments: rawComments.map((comment) => comment.split(';'))
      .map(([
        comment, commentRating, commentDate, authorName,
        authorEmail, authorAvatar, authorPassword]) => (
        {
          comment,
          rating: Number.parseFloat(commentRating),
          date: commentDate,
          author: {
            name: authorName,
            email: authorEmail,
            avatar: authorAvatar,
            password: authorPassword
          }
        }
      )),
    user: {
      name,
      email,
      avatar,
      password,
    }
  });
};

export { getErrorMessage, createFilm, createSHA256 };
