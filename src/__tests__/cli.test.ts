import path from "path";
import fs from "fs-extra";
import { run } from "../cliFunctions";
import { writeCheckFile } from "../writeCheckFile";
import { NpmAPI, PnpmAPI, YarnAPI, createTmpPackage } from "./utils";

describe("cli", () => {
  it("should automatically detect yarn.lock", async () => {
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "yarn.lock");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await yarn.install();
    await writeCheckFile(lockFile, checkFile);
    const result = await run(["--cwd", tmpPackage]);
    expect(result.msg).toBe("Install is not needed");
    await fs.remove(tmpPackage);
  });

  it("should automatically detect package-lock.json", async () => {
    const tmpPackage = await createTmpPackage();
    const npm = new NpmAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "package-lock.json");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await npm.install();
    await writeCheckFile(lockFile, checkFile);
    const result = await run(["--cwd", tmpPackage]);
    await npm.rmlockfile();
    await npm.rmmods();
    expect(result.msg).toBe("Install is not needed");
    await fs.remove(tmpPackage);
  });

  it("should automatically detect pnpm-lock.yaml", async () => {
    const tmpPackage = await createTmpPackage();
    const pnpm = new PnpmAPI(tmpPackage);
    const lockFile = path.join(tmpPackage, "pnpm-lock.yaml");
    const checkFile = path.join(tmpPackage, ".lockhash");
    await pnpm.install();
    await writeCheckFile(lockFile, checkFile);
    const result = await run(["--cwd", tmpPackage]);
    expect(result.msg).toBe("Install is not needed");
    await fs.remove(tmpPackage);
  });

  it("should fail to detect yarn.lock", async () => {
    const tmpPackage = await createTmpPackage();
    const yarn = new YarnAPI(tmpPackage);
    await yarn.rmlockfile();
    const result = await run(["--prefer=yarn", "--cwd", tmpPackage]);
    expect(result.msg).toBe("Lock file not found");
    await fs.remove(tmpPackage);
  });

  it("should fail to detect package-lock.json", async () => {
    const tmpPackage = await createTmpPackage();
    const npm = new NpmAPI(tmpPackage);
    await npm.rmlockfile();
    const result = await run(["--prefer=npm", "--cwd", tmpPackage]);
    expect(result.msg).toBe("Lock file not found");
    await fs.remove(tmpPackage);
  });

  it("should fail to detect pnpm-lock.yaml", async () => {
    const tmpPackage = await createTmpPackage();
    const pnpm = new PnpmAPI(tmpPackage);
    await pnpm.rmlockfile();
    const result = await run(["--prefer=pnpm", "--cwd", tmpPackage]);
    expect(result.msg).toBe("Lock file not found");
    await fs.remove(tmpPackage);
  });

  it("should write check file on postinstall", async () => {
    const tmpPackage = await createTmpPackage();
    const checkFile = path.join(tmpPackage, ".lockhash");
    const yarn = new YarnAPI(tmpPackage);
    await yarn.install();
    await run(["--postinstall", "--cwd", tmpPackage]);
    expect(fs.existsSync(checkFile)).toBe(true);
    await fs.remove(tmpPackage);
  });
});
