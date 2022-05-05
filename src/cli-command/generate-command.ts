import got from 'got';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import FilmGenerator from '../common/film-generator/film-generator.js';
import { MockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const filmsCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }

    const FilmGeneratorString = new FilmGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < filmsCount; i++) {
      await tsvFileWriter.write(`${FilmGeneratorString.generate()}\n`);
    }

    tsvFileWriter.close();
    console.log(`File ${filepath} was created!`);

  }
}
