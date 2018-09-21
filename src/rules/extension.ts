import fs from 'fs';
import path from 'path';
import { RegexRule } from '../regex-rule';

export class Extension extends RegexRule {
  protected getName() {
    return 'Extension';
  }

  protected shouldRun (resolvedPath: string) {
    return fs.lstatSync(resolvedPath).isFile();
  }

  protected getPart (resolvedPath: string) {
    return path.extname(resolvedPath);
  }
}
