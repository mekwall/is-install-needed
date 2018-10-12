import { YarnAPI } from './utils/YarnAPI';
import { TEST_PACKAGE_DIR } from './constants';
import { __await } from 'tslib';

const yarn = new YarnAPI(TEST_PACKAGE_DIR);

yarn.stdout.on('data', (data) => {
  process.stdout.write(data);
});

yarn.stderr.on('data', (data) => {
  process.stderr.write(data);
});

(async () => {
  await yarn.install();
  await yarn.add(['smallest']);
  await yarn.remove(['smallest']);
  await yarn.rmlockfile();
  await yarn.rmmods();
})();
