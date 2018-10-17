import * as yargs from 'yargs';
import * as path from 'path';
import { findClosestFile } from './findClosestFile';
import { isInstallNeeded } from './isInstallNeeded';
import { writeCheckFile } from './writeCheckFile';

function filterResult(paths: Array<string | null>) {
  return paths.sort((a, b) => {
    if (!a) {
      return 1;
    } else if (!b) {
      return -1;
    }
    return a.split(path.sep).length >= b.split(path.sep).length ? -1 : 1;
  })[0];
}

async function findLockfile(args?: string[]) {
  const argv = args ? yargs.parse(args) : yargs.argv;
  const cwd = argv.cwd || process.cwd();

  const yarnLockfile = path.join(cwd, 'yarn.lock');
  const npmLockfile = path.join(cwd, 'package-lock.json');
  const pnpmLockfile = path.join(cwd, 'shrinkwrap.yaml');

  if (argv.yarn) {
    return findClosestFile(path.basename(yarnLockfile), cwd);
  }

  if (argv.npm) {
    return findClosestFile(path.basename(npmLockfile), cwd);
  }

  if (argv.pnpm) {
    return findClosestFile(path.basename(pnpmLockfile), cwd);
  }

  const result = await Promise.all([
    findClosestFile(path.basename(yarnLockfile), cwd),
    findClosestFile(path.basename(npmLockfile), cwd),
    findClosestFile(path.basename(pnpmLockfile), cwd),
  ]);

  return filterResult(result);
}

function returnResult(code: number, msg?: string, silent = false) {
  if (process.env.NODE_ENV === 'test') {
    return { code, msg };
  }
  if (msg && !silent) {
    console.log(msg);
  }
  process.exit(code);
  return { code, msg };
}

export async function run(args?: string[]) {
  const argv = args ? yargs.parse(args) : yargs.argv;
  const lockfile = await findLockfile(args);
  const checkfilename = argv.checkfile || '.lockhash';
  if (lockfile) {
    const checkfile = path.join(path.dirname(lockfile), checkfilename);
    if (argv.postinstall) {
      await writeCheckFile(lockfile, checkfile);
      return returnResult(0);
    }
    if (await isInstallNeeded(lockfile, checkfile)) {
      return returnResult(1, 'Install is needed', argv.silent);
    }
    return returnResult(0, 'Install is not needed', argv.silent);
  }
  return returnResult(1, 'No lock file were found', argv.silent);
}
