import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createFilm, getErrorMessage } from '../utils/common.js';
import { CliCommandInterface } from './cli-command.interface';

class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private onLine(line: string) {
    const film = createFilm(line);
    console.log(film);
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
  }

  public async execute(fileName: string): Promise<void> {
    const fileReader = new TSVFileReader(fileName.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }

  }
}

export default ImportCommand;

