import chalk from 'chalk';
import { Level } from './types';

export class AntlerError extends Error {
  public message: string;

  public constructor (message: string, level: Level) {
    super(message);

    this.message = `${chalk.red(level.toUpperCase())} ${message}`;
  }
}
