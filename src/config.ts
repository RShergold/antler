import fs from 'fs';
import path from 'path';
import { CONFIG_FILE_NAME, UTF8 } from './constants';
import * as rules from './rules';
import { Config } from './types';

function getConfig (fullPath: string): {configPath: string, config: Config} {
  let directoryPath = fullPath;
  let directoryName = path.basename(directoryPath);
  let filePath = path.resolve(directoryPath, CONFIG_FILE_NAME);

  while (directoryName) {
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      let config;

      try {
        config = JSON.parse(fs.readFileSync(filePath, UTF8));
      } catch (error) {
        const message = error && error.message ? error.message : error;
        throw new Error(`Error reading config file at ${filePath} - ${message}`);
      }

      if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('Invalid config - must be an object');
      }

      if (!('rules' in config)) {
        throw new Error('Invalid config - no rules key');
      }

      if (!Object.keys(config.rules).length) {
        throw new Error('Invalid config - no rules configured');
      }

      for (const key in config.rules) {
        if (!(key in rules)) {
          throw new Error(`Unknown rule - ${key}`);
        }
      }

      return {
        configPath: filePath,
        config,
      };
    }

    directoryPath = path.resolve(directoryPath, '../');
    directoryName = path.basename(directoryPath);
    filePath = path.resolve(directoryPath, CONFIG_FILE_NAME);
  }

  throw new Error(`Could not find an ${CONFIG_FILE_NAME} file anywhere in path ${fullPath}`);
}

export default getConfig;
