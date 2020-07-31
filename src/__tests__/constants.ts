import path from "path";
export const TEST_PACKAGE_DIR = path.resolve(__dirname, "./test-package");
export const YARN_LOCK_FILE = path.join(TEST_PACKAGE_DIR, "yarn.lock");
export const NPM_LOCK_FILE = path.join(TEST_PACKAGE_DIR, "package-lock.json");
export const PNPM_LOCK_FILE = path.join(TEST_PACKAGE_DIR, "pnpm-lock.yaml");
export const CHECK_FILE = path.join(TEST_PACKAGE_DIR, ".lockhash");
