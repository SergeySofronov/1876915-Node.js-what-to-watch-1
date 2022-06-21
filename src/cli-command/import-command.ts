import { UserModel } from '../modules/user/user.entity.js';
import { FilmModel } from '../modules/film/film.entity.js';
import { CommentModel } from '../modules/comment/comment.entity.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { FilmServiceInterface } from '../modules/film/film-service.interface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { CommentServiceInterface } from '../modules/comment/comment-service.interface.js';
import { CliCommandInterface } from './cli-command.interface';
import { ConfigInterface } from '../common/config/config.interface.js';
import { createFilm, getErrorMessage } from '../utils/common.js';
import { getURI } from '../utils/db.js';
import { Film } from '../types/film.type.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import FilmService from '../modules/film/film.service.js';
import UserService from '../modules/user/user.service.js';
import DatabaseService from '../common/database-client/database.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import ConfigService from '../common/config/config.service.js';
import CommentService from '../modules/comment/comment.service.js';

class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private fileReader!: TSVFileReader;
  private userService!: UserServiceInterface;
  private filmService!: FilmServiceInterface;
  private commentService!: CommentServiceInterface;
  private databaseService!: DatabaseInterface;
  private config!: ConfigInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.logger = new ConsoleLoggerService();
    this.filmService = new FilmService(this.logger, FilmModel);
    this.userService = new UserService(this.logger, UserModel);
    this.commentService = new CommentService(this.logger, CommentModel);
    this.databaseService = new DatabaseService(this.logger);
    this.config = new ConfigService(this.logger);
  }

  private async saveFilm(film: Film) {
    let user = await this.userService.findOrCreate(film.user, this.salt);
    const newFilm = await this.filmService.create({
      ...film,
      userId: user.id,
    });

    for (const comment of film.comments) {
      user = await this.userService.findOrCreate(comment.user, this.salt);
      await this.commentService.findOrCreate(newFilm.id, { ...comment, userId: user.id, filmId:newFilm.id });
    }

  }

  private onLine = async (line: string, resolve: () => void) => {
    try {
      const film = createFilm(line);
      await this.saveFilm(film);
    } catch (err) {
      this.logger.error(`Can't create film: ${getErrorMessage(err)}`);
    }
    resolve();
  };

  private onComplete = (count: number) => console.log(`${count} rows imported.`);

  public async execute(fileName: string, ...rest: string[]): Promise<void> {
    let [login, password, host, port, dbName, salt] = rest;

    login = login ?? this.config.get('DB_USER');
    password = password ?? this.config.get('DB_PASSWORD');
    host = host ?? this.config.get('DB_HOST');
    port = port ?? String(this.config.get('DB_PORT'));
    dbName = dbName ?? this.config.get('DB_NAME');
    salt = salt ?? this.config.get('SALT');
    this.salt = salt;

    const uri = getURI(login, password, host, port ? parseInt(port, 10) : this.config.get('DB_PORT'), dbName);
    await this.databaseService.connect(uri);

    this.fileReader = new TSVFileReader(fileName.trim());
    this.fileReader.on('line', this.onLine);
    this.fileReader.on('end', this.onComplete);

    try {
      await this.fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    } finally {
      this.fileReader.removeAllListeners();
      this.databaseService.disconnect();
    }

  }
}

export default ImportCommand;

