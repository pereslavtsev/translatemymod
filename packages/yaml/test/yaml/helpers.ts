import fs from 'fs';
import path from 'path';

export function readExampleFile(filename: string) {
  return fs.promises.readFile(path.resolve(__dirname, 'examples', filename));
}
