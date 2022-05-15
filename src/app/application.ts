import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../common/config/config.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { Component } from '../types/component.type.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { getURI } from '../utils/db.js';

@injectable()
class Application {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface
  ) { }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`Get value from env $SALT: ${this.config.get('SALT')}`);
    this.logger.info(`Get value from env $DB_USER: ${this.config.get('DB_USER')}`);
    this.logger.info(`Get value from env $DB_PASSWORD: ${this.config.get('DB_PASSWORD')}`);
    this.logger.info(`Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`Get value from env $DB_PORT: ${this.config.get('DB_PORT')}`);
    this.logger.info(`Get value from env $DB_NAME: ${this.config.get('DB_NAME')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    this.logger.info(uri);

    await this.databaseClient.connect(uri);
  }
}

export default Application;
