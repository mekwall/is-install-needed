import fs from "fs-extra";
import { fileHash } from "./fileHash";
import { findClosestLockfile } from "./findClosestLockfile";

export async function writeCheckFile(
  lockfile?: string,
  checkfile = ".lockhash",
) {
  if (!lockfile) {
    lockfile = await findClosestLockfile();
  }
  if (!lockfile) {
    throw new Error("Lock file not found");
  }
  try {
    const sha = await fileHash(lockfile);
    fs.writeFileSync(checkfile, sha);
    return true;
  } catch (e) {
    return false;
  }
}
