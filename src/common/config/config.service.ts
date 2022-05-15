import 'reflect-metadata';
import { config } from 'dotenv';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { ConfigSchema, configSchema } from './config.schema.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';

@injectable()
class ConfigService implements ConfigInterface {
  private config: ConfigSchema;  // переменные окружения
  private logger: LoggerInterface;    // логгер (pino)

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    // config():{parsed,error} - создает перем. окружения на время работы приложения, помещает в parsed

    if (config().error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }
    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.error });

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}

export default ConfigService;

