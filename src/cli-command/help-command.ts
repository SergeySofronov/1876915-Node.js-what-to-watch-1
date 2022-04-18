import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            main.js ${chalk.red('--<command>')} ${chalk.blue('[--arguments]')}
        Команды:
            ${chalk.red('--version')}:                        /* Выводит информацию о версии приложения */
            ${chalk.red('--help')}:                           /* Выводит список и описание всех поддерживаемых аргументов */
            ${chalk.red('--import')} ${chalk.green('<filePath>')}:              /* Импортирует в базу данных информацию из tsv-файла. */
            ${chalk.red('--generate')} ${chalk.blue('<n>')} ${chalk.green('<filePath>')} ${chalk.yellow('<url>')}:  /* Создаёт файл в формате tsv с тестовыми данными.
                                                 Параметр n задаёт количество генерируемых карточек для фильмов.
                                                 Параметр filepath указывает путь для сохранения файла с описанием карточек фильмов.
                                                 Параметр <url> задаёт адрес сервера, с которого необходимо взять данные.
        `);
  }
}

export default HelpCommand;
