import { fileHash } from "../fileHash";
import { YARN_LOCK_FILE, TEST_PACKAGE_DIR } from "./constants";
import { YarnAPI } from "./utils/YarnAPI";

const yarn = new YarnAPI(TEST_PACKAGE_DIR);

describe("fileHash", () => {
  it("should generate hash from file", async () => {
    await yarn.install();
    const hash = fileHash(YARN_LOCK_FILE);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(40);
    await yarn.rmlockfile();
    await yarn.rmmods();
  });

  it("should throw exception when file doesn't exist", async () => {
    try {
      await fileHash("/dev/null");
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
