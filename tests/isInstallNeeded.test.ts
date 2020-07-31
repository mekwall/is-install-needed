import fs from "fs-extra";
import { isInstallNeeded } from "../src";
import { writeCheckFile } from "../src/writeCheckFile";
import { TEST_PACKAGE_DIR, YARN_LOCK_FILE, CHECK_FILE } from "./constants";
import { YarnAPI } from "./utils/YarnAPI";

const yarn = new YarnAPI(TEST_PACKAGE_DIR);

describe("isInstallNeeded", () => {
  beforeAll(async (done) => {
    await yarn.install();
    done();
  });

  afterAll(async (done) => {
    await yarn.rmlockfile();
    await yarn.rmmods();
    done();
  });

  it("should say needed and create a check file", async () => {
    expect.assertions(2);
    await fs.remove(CHECK_FILE);
    const result = await isInstallNeeded(YARN_LOCK_FILE, CHECK_FILE);
    expect(result).toBe(true);
    expect(await fs.pathExists(CHECK_FILE)).toBe(true);
  });

  it("should say it's not needed when check file exist and have the same hash", async () => {
    expect.assertions(1);
    await writeCheckFile(YARN_LOCK_FILE, CHECK_FILE);
    const result = await isInstallNeeded(YARN_LOCK_FILE, CHECK_FILE);
    expect(result).toBe(false);
  });

  it("should say it's needed when lock file has changed", async (done) => {
    expect.assertions(1);
    await writeCheckFile(YARN_LOCK_FILE, CHECK_FILE);
    await yarn.add(["smallest"]);
    setTimeout(async () => {
      const result = await isInstallNeeded(YARN_LOCK_FILE, CHECK_FILE);
      await yarn.remove(["smallest"]);
      expect(result).toBe(true);
      done();
    }, 1000);
  });

  it("should say needed because node_modules doesn't exist", async () => {
    expect.assertions(1);
    await yarn.rmmods();
    const result = await isInstallNeeded(YARN_LOCK_FILE, CHECK_FILE);
    expect(result).toBe(true);
  });
});
