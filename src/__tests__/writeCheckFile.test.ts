import fs from "fs-extra";
import { writeCheckFile } from "../writeCheckFile";
import { CHECK_FILE, YARN_LOCK_FILE, TEST_PACKAGE_DIR } from "./constants";
import { YarnAPI } from "./utils/YarnAPI";

const yarn = new YarnAPI(TEST_PACKAGE_DIR);

describe("writeCheckFile", () => {
  beforeAll(async () => {
    await yarn.install();
  });

  afterAll(async () => {
    await yarn.rmlockfile();
    await yarn.rmmods();
    await fs.remove(CHECK_FILE);
  });

  it("should write check file", async () => {
    expect.assertions(2);
    await fs.remove(CHECK_FILE);
    const result = await writeCheckFile(YARN_LOCK_FILE, CHECK_FILE);
    expect(result).toBe(true);
    expect(fs.existsSync(CHECK_FILE)).toBe(true);
  });

  it("should fail to write check file", async () => {
    expect.assertions(1);
    const result = await writeCheckFile(YARN_LOCK_FILE, "/dev/nope");
    expect(result).toBe(false);
  });
});
