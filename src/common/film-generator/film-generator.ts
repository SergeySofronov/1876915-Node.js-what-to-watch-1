import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { getRandomFloatFixed, getRandomInteger, getRandomItemInArray, getRandomItemsInArray } from '../../utils/random.js';
import { FilmGeneratorInterface } from './film-generator.interface.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const YEAR_DELTA = 50;
const FILM_RATING_MIN = 1;
const FILM_RATING_MAX = 10;
const FILM_RUNTIME_MIN = 60;
const FILM_RUNTIME_MAX = 240;

class FilmGenerator implements FilmGeneratorInterface {
  constructor(private readonly mockData: MockData) { }

  public generate(): string {
    const year = dayjs().year();
    const films = this.mockData.films;
    const users: string[][] = [];
    const emails = Array.from(new Set<string>(this.mockData.users.emails));
    const names = this.mockData.users.names;
    const avatars = this.mockData.users.avatars;
    const passwords = this.mockData.users.passwords;

    for (let i = 0; i < emails.length; i++) {
      users.push([
        names[i],
        emails[i],
        avatars[i],
        passwords[i],
      ]);
    }

    const title = getRandomItemInArray<string>(films.titles);
    const description = getRandomItemInArray<string>(films.descriptions);
    const publicationDate = dayjs().subtract(getRandomInteger(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const genre = getRandomItemInArray<string>(films.genres);
    const released = getRandomInteger(year - YEAR_DELTA, year);
    const previewVideoLink = getRandomItemInArray<string>(films.previewVideoLinks);
    const videoLink = getRandomItemInArray<string>(films.videoLinks);
    const starring = getRandomItemsInArray<string>(films.starring);
    const director = getRandomItemInArray<string>(films.directors);
    const runtime = getRandomInteger(FILM_RUNTIME_MIN, FILM_RUNTIME_MAX);
    const posterImage = getRandomItemInArray<string>(films.posterImages);
    const backgroundImage = getRandomItemInArray<string>(films.backgroundImages);
    const backgroundColor = getRandomItemInArray<string>(films.backgroundColors);

    let rating = 0;
    const comments = getRandomItemsInArray<string>(films.comments)
      .map((comment) => {
        const userRating = getRandomFloatFixed(FILM_RATING_MIN, FILM_RATING_MAX);
        rating += userRating;
        return [
          comment,
          userRating,
          dayjs().subtract(getRandomInteger(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString(),
          ...users[getRandomInteger(0, users.length - 1)]
        ].join(';');
      });

    return [
      title,
      description,
      publicationDate,
      genre,
      released,
      (rating / comments.length).toFixed(1),
      previewVideoLink,
      videoLink,
      starring,
      director,
      runtime,
      posterImage,
      backgroundImage,
      backgroundColor,
      comments.join('|'),
      ...users[getRandomInteger(0, users.length - 1)]
    ].join('\t');
  }
}

export default FilmGenerator;
