import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createFilm, getErrorMessage } from '../utils/common.js';
import { CliCommandInterface } from './cli-command.interface';

class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';

  private fileReader!: TSVFileReader;

  private onLine = (line: string) => {
    const film = createFilm(line);
    console.log(film);
  };

  private onComplete = (count: number) => console.log(`${count} rows imported.`);

  public async execute(fileName: string): Promise<void> {
    this.fileReader = new TSVFileReader(fileName.trim());
    this.fileReader.on('line', this.onLine);
    this.fileReader.on('end', this.onComplete);

    try {
      await this.fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    } finally {
      this.fileReader.removeAllListeners();
    }

  }
}

export default ImportCommand;

