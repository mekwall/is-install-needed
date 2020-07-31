import fs from "fs-extra";
import path from "path";
import { fileHash } from "./fileHash";
import { writeCheckFile } from "./writeCheckFile";
import { findClosestLockfile } from "./findClosestLockfile";

export async function isInstallNeeded(
  lockfile?: string,
  checkfile = ".lockhash",
  cb?: (isNeeded: boolean) => void,
) {
  let needed = false;
  if (!lockfile) {
    lockfile = await findClosestLockfile(process.cwd());
  }
  if (!lockfile) {
    throw Error("Lock file not found");
  }
  const dir = path.dirname(lockfile);
  const nodeModulesExist = await fs.pathExists(path.join(dir, "node_modules"));
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
  if (typeof cb === "function") {
    cb(needed);
  }
  return needed;
}
