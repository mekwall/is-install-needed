import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { YarnAPI } from './utils/YarnAPI';
import {
  TEST_PACKAGE_DIR,
  CHECK_FILE,
  YARN_LOCK_FILE,
  NPM_LOCK_FILE,
  PNPM_LOCK_FILE,
} from './constants';
import { NpmAPI } from './utils/NpmAPI';
import { PnpmAPI } from './utils/PnpmAPI';
import { run } from '../src/cliFunctions';
import { writeCheckFile } from '../src/writeCheckFile';

const yarn = new YarnAPI(TEST_PACKAGE_DIR);
const npm = new NpmAPI(TEST_PACKAGE_DIR);
const pnpm = new PnpmAPI(TEST_PACKAGE_DIR);

describe('cli', () => {
  beforeAll(() => {
    fs.removeSync(CHECK_FILE);
  });

  afterAll(() => {
    fs.removeSync(CHECK_FILE);
  });

  it('should automatically detect yarn.lock', async () => {
    await yarn.install();
    await writeCheckFile(YARN_LOCK_FILE, CHECK_FILE);
    const result = await run(['--cwd', TEST_PACKAGE_DIR]);
    await yarn.rmlockfile();
    await yarn.rmmods();
    expect(result.msg).toBe('Install is not needed');
  });

  it('should automatically detect package-lock.json', async () => {
    await npm.install();
    await writeCheckFile(NPM_LOCK_FILE, CHECK_FILE);
    const result = await run(['--cwd', TEST_PACKAGE_DIR]);
    await npm.rmlockfile();
    await npm.rmmods();
    expect(result.msg).toBe('Install is not needed');
  });

  it('should automatically detect shrinkwrap.yaml', async () => {
    await pnpm.install();
    await writeCheckFile(PNPM_LOCK_FILE, CHECK_FILE);
    const result = await run(['--cwd', TEST_PACKAGE_DIR]);
    await pnpm.rmlockfile();
    await pnpm.rmmods();
    expect(result.msg).toBe('Install is not needed');
  });

  it('should fail to detect yarn.lock', async (done) => {
    const TMP_DIR = path.join(os.tmpdir(), 'test-package');
    await yarn.rmlockfile();
    fs.moveSync(TEST_PACKAGE_DIR, TMP_DIR);
    setTimeout(async () => {
      const result = await run(['--prefer=yarn', '--cwd', TMP_DIR]);
      fs.moveSync(TMP_DIR, TEST_PACKAGE_DIR);
      expect(result.msg).toBe('Lock file not found');
      done();
    }, 1000);
  });

  it('should fail to detect package-lock.json', async (done) => {
    const TMP_DIR = path.join(os.tmpdir(), 'test-package');
    await npm.rmlockfile();
    fs.moveSync(TEST_PACKAGE_DIR, TMP_DIR);
    setTimeout(async () => {
      const result = await run(['--prefer=npm', '--cwd', TMP_DIR]);
      fs.moveSync(TMP_DIR, TEST_PACKAGE_DIR);
      expect(result.msg).toBe('Lock file not found');
      done();
    }, 1000);
  });

  it('should fail to detect shrinkwrap.yaml', async (done) => {
    const TMP_DIR = path.join(os.tmpdir(), 'test-package');
    await npm.rmlockfile();
    fs.moveSync(TEST_PACKAGE_DIR, TMP_DIR);
    setTimeout(async () => {
      const result = await run(['--prefer=pnpm', '--cwd', TMP_DIR]);
      fs.moveSync(TMP_DIR, TEST_PACKAGE_DIR);
      expect(result.msg).toBe('Lock file not found');
      done();
    }, 1000);
  });

  it('should write check file on postinstall', async (done) => {
    await yarn.install();
    fs.removeSync(CHECK_FILE);
    await run(['--postinstall', '--cwd', TEST_PACKAGE_DIR]);
    expect(fs.existsSync(CHECK_FILE)).toBe(true);
    await yarn.rmlockfile();
    await yarn.rmmods();
    done();
  });
});
