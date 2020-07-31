import fs from "fs-extra";
import path from "path";
import os from "os";

export * from "./NpmAPI";
export * from "./PnpmAPI";
export * from "./YarnAPI";

const pkg = `{
  "name": "test-package",
  "private": true,
  "dependencies": {
    "dlv": "*"
  }
}`;

const tmpDirs: string[] = [];

export async function createTmpPackage() {
  const tmpDir = path.join(
    os.tmpdir(),
    "is-install-needed",
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5),
  );
  await fs.mkdirp(tmpDir);
  await fs.writeFile(path.join(tmpDir, "package.json"), pkg);
  tmpDirs.push(tmpDir);
  return tmpDir;
}

process.on("beforeExit", () => {
  // Attempt to clean up
  for (const tmpDir of [
    ...tmpDirs,
    path.join(os.tmpdir(), "is-install-needed"),
  ]) {
    try {
      fs.removeSync(tmpDir);
    } catch {
      // Ignore
    }
  }
});
