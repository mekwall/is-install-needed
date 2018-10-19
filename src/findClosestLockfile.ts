import * as path from 'path';
import { findClosestFile } from './findClosestFile';

function filterResult(paths: Array<string | undefined>) {
  return paths.sort((a, b) => {
    if (!a) {
      return 1;
    } else if (!b) {
      return -1;
    }
    return a.split(path.sep).length >= b.split(path.sep).length ? -1 : 1;
  })[0];
}

export async function findClosestLockfile(
  cwd = process.cwd(),
  prefer?: string
) {
  const yarnLockfile = path.join(cwd, 'yarn.lock');
  const npmLockfile = path.join(cwd, 'package-lock.json');
  const pnpmLockfile = path.join(cwd, 'shrinkwrap.yaml');

  switch (prefer) {
    case 'yarn':
      return findClosestFile(path.basename(yarnLockfile), cwd);
    case 'npm':
      return findClosestFile(path.basename(npmLockfile), cwd);
    case 'pnpm':
      return findClosestFile(path.basename(pnpmLockfile), cwd);
  }

  const result = await Promise.all([
    findClosestFile(path.basename(yarnLockfile), cwd),
    findClosestFile(path.basename(npmLockfile), cwd),
    findClosestFile(path.basename(pnpmLockfile), cwd),
  ]);

  return filterResult(result);
}
