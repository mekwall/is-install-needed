import * as yargs from 'yargs';
import * as path from 'path';
import { findClosestFile } from './findClosestFile';
import { isInstallNeeded } from './isInstallNeeded';
import { writeCheckFile } from './writeCheckFile';

async function findLockfile(args?: string[]) {
  const argv = args ? yargs.parse(args) : yargs.argv;
  const cwd = argv.cwd || process.cwd();

  const yarnLockfile = path.join(cwd, 'yarn.lock');
  const npmLockfile = path.join(cwd, 'package-lock.json');

  if (argv.yarn) {
    return findClosestFile(path.basename(yarnLockfile), cwd);
  }

  if (argv.npm) {
    return findClosestFile(path.basename(npmLockfile), cwd);
  }

  const result = await Promise.all([
    findClosestFile(path.basename(yarnLockfile), cwd),
    findClosestFile(path.basename(npmLockfile), cwd),
  ]);
  let lockfile = null;
  if (result[0] && result[1]) {
    lockfile =
      result[0].split(path.sep).length >= result[1].split(path.sep).length
        ? result[0]
        : result[1];
  } else if (result[0]) {
    lockfile = result[0];
  } else if (result[1]) {
    lockfile = result[1];
  }
  return lockfile;
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

if (process.env.NODE_ENV !== 'test') {
  run();
}
