import fs from "fs-extra";
import path from "path";
import { YarnAPI, NpmAPI, PnpmAPI, createTmpPackage } from "./utils";
import { findClosestFile } from "../findClosestFile";

describe("findClosestFile", () => {
  it("should find yarn.lock", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    await yarn.install();
    const result = await findClosestFile("yarn.lock", tmpPackage);
    expect(result).toBe(lockFile);
    await yarn.rmlockfile();
    await yarn.rmmods();
    await fs.remove(tmpPackage);
  });

  it("should find package-lock.json", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const npm = new NpmAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "package-lock.json");
    await npm.install();
    const result = await findClosestFile("package-lock.json", tmpPackage);
    expect(result).toBe(lockFile);
    await npm.rmlockfile();
    await npm.rmmods();
    await fs.remove(tmpPackage);
  });

  it("should find pnpm-lock.yaml", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const pnpm = new PnpmAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "pnpm-lock.yaml");
    await pnpm.install();
    const result = await findClosestFile("pnpm-lock.yaml", tmpPackage);
    expect(result).toBe(lockFile);
    await pnpm.rmlockfile();
    await pnpm.rmmods();
    await fs.remove(tmpPackage);
  });
});
