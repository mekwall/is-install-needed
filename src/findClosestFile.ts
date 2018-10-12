import * as path from 'path';
import * as fs from 'fs-extra';

const defaultCheck = async (dir: string, filename: string) =>
  fs.pathExists(path.join(dir, filename));

export async function findClosestFile(
  filename: string,
  start?: string | string[],
  check?: typeof defaultCheck
): Promise<string | null> {
  if (!module.parent) {
    throw Error('Module has no parent');
  }
  start = start || module.parent.filename;
  check = check || defaultCheck;

  if (typeof start === 'string') {
    if (start[start.length - 1] !== path.sep) {
      start += path.sep;
    }
    start = start.split(path.sep);
  }

  if (!start.length) {
    return null;
  }

  start.pop();
  const dir = start.join(path.sep);
  if (!dir) {
    return null;
  }

  try {
    if (await check(dir, filename)) {
      return path.resolve(dir, filename);
    }
  } catch (e) {
    // Do nothing
  }

  return findClosestFile(filename, start, check);
}
