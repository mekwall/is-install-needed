import { findClosestFile } from '../src/findClosestFile';
import { TEST_PACKAGE_DIR, YARN_LOCK_FILE, NPM_LOCK_FILE } from './constants';
import { YarnAPI } from './utils/YarnAPI';
import { NpmAPI } from './utils/npmAPI';
import { __await } from 'tslib';

const yarn = new YarnAPI(TEST_PACKAGE_DIR);
const npm = new NpmAPI(TEST_PACKAGE_DIR);

describe('findClosestFile', () => {
  it('should find yarn.lock', async () => {
    expect.assertions(1);
    await yarn.install();
    const result = await findClosestFile('yarn.lock', TEST_PACKAGE_DIR);
    expect(result).toBe(YARN_LOCK_FILE);
    await yarn.rmlockfile();
    await yarn.rmmods();
  });

  it('should find package-lock.json', async () => {
    expect.assertions(1);
    await npm.install();
    const result = await findClosestFile('package-lock.json', TEST_PACKAGE_DIR);
    expect(result).toBe(NPM_LOCK_FILE);
    await npm.rmlockfile();
    await npm.rmmods();
  });
});
