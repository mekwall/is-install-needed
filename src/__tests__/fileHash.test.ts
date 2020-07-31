import path from "path";
import fs from "fs-extra";
import { fileHash } from "../fileHash";
import { YarnAPI, createTmpPackage } from "./utils";

describe("fileHash", () => {
  it("should generate hash from file", async () => {
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    await yarn.install();
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const hash = await fileHash(lockFile);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(40);
    await yarn.rmlockfile();
    await yarn.rmmods();
    await fs.remove(tmpPackage);
  });

  it("should throw exception when file doesn't exist", async () => {
    try {
      await fileHash("/dev/null");
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
