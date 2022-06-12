import crypto from 'crypto';
import { Film } from '../types/film.type';
import { plainToInstance, ClassConstructor } from 'class-transformer';

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

const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });

const createErrorObject = (message: string) => ({
  error: message,
});

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

export {
  getErrorMessage,
  createFilm,
  createSHA256,
  fillDTO,
  createErrorObject,
  ValidityMessage
};
