import * as fs from 'fs-extra';
import * as path from 'path';
import { fileHash } from './fileHash';
import { writeCheckFile } from './writeCheckFile';

export async function isInstallNeeded(
  lockfile: string,
  checkfile: string,
  cb?: (isNeeded: boolean) => void
) {
  let needed = false;
  const dir = path.dirname(lockfile);
  const nodeModulesExist = await fs.pathExists(path.join(dir, 'node_modules'));
  if (!nodeModulesExist) {
    needed = true;
  } else if (!(await fs.pathExists(checkfile))) {
    needed = true;
    writeCheckFile(lockfile, checkfile);
  } else {
    const prevHash = fs.readFileSync(checkfile).toString();
    const currentHash = await fileHash(lockfile);
    if (prevHash !== currentHash) {
      needed = true;
    }
  }
  if (typeof cb === 'function') {
    cb(needed);
  }
  return needed;
}
