import yargs from "yargs";
import path from "path";
import { findClosestLockfile } from "./findClosestLockfile";
import { isInstallNeeded } from "./isInstallNeeded";
import { writeCheckFile } from "./writeCheckFile";

function returnResult(code: number, msg?: string, silent = false) {
  if (process.env.NODE_ENV === "test") {
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
  const lockfile = await findClosestLockfile(argv.cwd, argv.prefer);
  const checkfilename = argv.checkfile || ".lockhash";
  if (lockfile) {
    const checkfile = path.join(path.dirname(lockfile), checkfilename);
    if (argv.postinstall) {
      await writeCheckFile(lockfile, checkfile);
      return returnResult(0);
    }
    if (await isInstallNeeded(lockfile, checkfile)) {
      return returnResult(1, "Install is needed", argv.silent);
    }
    return returnResult(0, "Install is not needed", argv.silent);
  }
  return returnResult(1, "Lock file not found", argv.silent);
}
