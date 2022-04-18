import { readFileSync } from 'fs';
import { Film } from '../../types/film.type';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';
  public filename = '';

  constructor(filename: string) {
    this.filename = filename;
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Film[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        name,
        email,
        avatar,
        password,
        title,
        description,
        release,
        rating,
        previewVideoLink,
        videoLink,
        starring,
        director,
        runTime,
        posterImage,
        backgroundImage,
        backgroundColor,
        comments
      ]) => ({
        name: title,
        description,
        release,
        rating: Number(rating),
        previewVideoLink,
        videoLink,
        starring: starring.split(';'),
        director,
        runTime: Number.parseInt(runTime, 10),
        commentsCount: comments.split(';').length,
        posterImage,
        backgroundImage,
        backgroundColor,
        user: {
          name,
          email,
          avatar,
          password,
        }
      }));
  }
}
