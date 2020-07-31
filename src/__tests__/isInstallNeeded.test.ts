import fs from "fs-extra";
import path from "path";
import { isInstallNeeded } from "../";
import { writeCheckFile } from "../writeCheckFile";
import { YarnAPI, createTmpPackage, NpmAPI } from "./utils";
import { NOMEM } from "dns";

describe("isInstallNeeded", () => {
  it("should say needed and create a check file", async () => {
    expect.assertions(2);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await yarn.install();
    const result = await isInstallNeeded(lockFile, checkFile);
    expect(result).toBe(true);
    expect(await fs.pathExists(checkFile)).toBe(true);
    await fs.remove(tmpPackage);
  });

  it("should say it's not needed when check file exist and have the same hash", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await yarn.install();
    await writeCheckFile(lockFile, checkFile);
    const result = await isInstallNeeded(lockFile, checkFile);
    expect(result).toBe(false);
    await fs.remove(tmpPackage);
  });

  it("should say it's needed when lock file has changed", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await writeCheckFile(lockFile, checkFile);
    await yarn.add(["smallest"]);
    const result = await isInstallNeeded(lockFile, checkFile);
    await yarn.remove(["smallest"]);
    expect(result).toBe(true);
    await fs.remove(tmpPackage);
  });

  it("should say needed because .yarn doesn't exist", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await yarn.install();
    await yarn.rmmods();
    const result = await isInstallNeeded(lockFile, checkFile);
    expect(result).toBe(true);
    await fs.remove(tmpPackage);
  });

  it("should say needed because node_modules doesn't exist", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const npm = new NpmAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "package-lock.json");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await npm.install();
    await npm.rmmods();
    const result = await isInstallNeeded(lockFile, checkFile);
    expect(result).toBe(true);
    await fs.remove(tmpPackage);
  });
});
