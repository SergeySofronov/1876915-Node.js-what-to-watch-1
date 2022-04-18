import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface';

class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  public execute(fileName: string): void {
    try {
      const fileReader = new TSVFileReader(fileName.trim());
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.log(`Не удалось импортировать данные из файла по причине: «${err.message}»`);
    }
  }
}

export default ImportCommand;

