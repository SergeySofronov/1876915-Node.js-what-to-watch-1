import { ConfigSchema } from './config.schema';

interface ConfigInterface {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}

export { ConfigInterface };
