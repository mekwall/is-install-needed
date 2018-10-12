import * as fs from 'fs-extra';
import { fileHash } from './fileHash';

export async function writeCheckFile(lockfile: string, checkfile: string) {
  try {
    const sha = await fileHash(lockfile);
    fs.writeFileSync(checkfile, sha);
    return true;
  } catch (e) {
    return false;
  }
}
