import crypto from 'crypto';
import * as jose from 'jose';
import { Film } from '../types/film.type';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { FilmGenreType } from '../types/film-genre.enum.js';
import { EntityFilter } from '../types/entity-filter.type.js';
import { JWT_MAX_AGE } from '../modules/user/user.constant.js';

type GroupFilter = {
  filmFilter?: EntityFilter;
  userFilter?: EntityFilter;
}

enum ValidityMessage {
  isStringMessage = 'Field \u00AB$property\u00BB must be a string',
  isNotEmptyMessage = 'Field \u00AB$property\u00BB must not be empty',
  minValueMessage = 'Field \u00AB$property\u00BB value/length must be equal or greater than $constraint1',
  maxValueMessage = 'Field \u00AB$property\u00BB value/length must be equal or less than $constraint1',
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};


const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V, groups?: GroupFilter) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true, groups: [`${groups?.filmFilter ?? EntityFilter.FILM_FULL}`, `${groups?.userFilter ?? EntityFilter.USER_FULL}`] });

const createErrorObject = (message: string) => ({
  error: message,
});

const getNotFoundPage = (path: string) => (
  `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <title>Error</title>
  </head>
  <body>
  <pre>Cannot GET ${path}</pre>
  </body>
  </html>`
);

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(JWT_MAX_AGE)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

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
    genre: FilmGenreType[genre as keyof typeof FilmGenreType],
    released,
    rating: Number.parseFloat(rating),
    previewVideoLink,
    videoLink,
    starring: starring.split(','),
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
          user: {
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

export {
  getErrorMessage,
  createFilm,
  createSHA256,
  fillDTO,
  createErrorObject,
  ValidityMessage,
  getNotFoundPage
};
