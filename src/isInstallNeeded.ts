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

  const [checkFileExists, isYarn, nodeModulesExist] = await Promise.all(
    [
      checkfile,
      path.join(dir, ".yarn"),
      path.join(dir, "node_modules"),
    ].map((p) => fs.pathExists(p)),
  );

  if (!isYarn && !nodeModulesExist) {
    needed = true;
  } else if (!checkFileExists) {
    needed = true;
    await writeCheckFile(lockfile, checkfile);
  } else {
    const [prevHash, currentHash] = await Promise.all([
      fs.readFile(checkfile),
      fileHash(lockfile),
    ]).then((v) => v.map((v) => v.toString()));
    if (prevHash !== currentHash) {
      needed = true;
    }
  }
  if (typeof cb === "function") {
    cb(needed);
  }
  return needed;
}
