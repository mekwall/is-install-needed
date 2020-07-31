import fs from "fs-extra";
import path from "path";
import { writeCheckFile } from "../writeCheckFile";
import { createTmpPackage, YarnAPI } from "./utils";

describe("writeCheckFile", () => {
  it("should write check file", async () => {
    expect.assertions(2);
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await yarn.install();
    const result = await writeCheckFile(lockFile, checkFile);
    expect(result).toBe(true);
    expect(fs.existsSync(checkFile)).toBe(true);
    await fs.remove(tmpPackage);
  });

  it("should fail to write check file", async () => {
    expect.assertions(1);
    const tmpPackage = await createTmpPackage();
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const result = await writeCheckFile(lockFile, "/dev/nope");
    expect(result).toBe(false);
    await fs.remove(tmpPackage);
  });
});
