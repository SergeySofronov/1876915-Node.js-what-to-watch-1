import { createWriteStream, WriteStream } from 'fs';
import { FileWriterInterface } from './file-writer.interface.js';

class TSVFileWriter implements FileWriterInterface {
  private stream: WriteStream;

  constructor(public readonly filename: string) {
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf8',
      highWaterMark: 2 ** 16,
      autoClose: true,
    });
  }

  public async write(row: string): Promise<void> {
    if (!this.stream.write(`${row}`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => {this.stream.end(); resolve();});
      });
    }

    return Promise.resolve();
  }
}

export default TSVFileWriter;
