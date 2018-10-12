import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { YarnAPI } from './utils/YarnAPI';
import { TEST_PACKAGE_DIR, CHECK_FILE } from './constants';
import { NpmAPI } from './utils/NpmAPI';
import { run } from '../src/cli';

const yarn = new YarnAPI(TEST_PACKAGE_DIR);
const npm = new NpmAPI(TEST_PACKAGE_DIR);

describe('cli', () => {
  it('should automatically detect yarn.lock', async () => {
    await yarn.install();
    const result = await run(['--cwd', TEST_PACKAGE_DIR]);
    await yarn.rmlockfile();
    await yarn.rmmods();
    expect(result.msg).toBe('Install is not needed');
  });

  it('should automatically detect package-lock.json', async () => {
    await npm.install();
    const result = await run(['--cwd', TEST_PACKAGE_DIR]);
    await npm.rmlockfile();
    await npm.rmmods();
    expect(result.msg).toBe('Install is not needed');
  });

  it('should fail to detect yarn.lock', async () => {
    const TMP_DIR = path.join(os.tmpdir(), 'test-package');
    await yarn.rmlockfile();
    fs.moveSync(TEST_PACKAGE_DIR, TMP_DIR);
    const result = await run(['--yarn', '--cwd', TMP_DIR]);
    fs.moveSync(TMP_DIR, TEST_PACKAGE_DIR);
    expect(result.msg).toBe('No lock file were found');
  });

  it('should fail to detect package-lock.json', async () => {
    const TMP_DIR = path.join(os.tmpdir(), 'test-package');
    await npm.rmlockfile();
    fs.moveSync(TEST_PACKAGE_DIR, TMP_DIR);
    const result = await run(['--npm', '--cwd', TMP_DIR]);
    fs.moveSync(TMP_DIR, TEST_PACKAGE_DIR);
    expect(result.msg).toBe('No lock file were found');
  });

  it('should write check file on postinstall', async (done) => {
    await yarn.install();
    await fs.remove(CHECK_FILE);
    await run(['--postinstall', '--cwd', TEST_PACKAGE_DIR]);
    expect(fs.existsSync(CHECK_FILE)).toBe(true);
    await yarn.rmlockfile();
    await yarn.rmmods();
    done();
  });
});
