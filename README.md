# is-install-needed

[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/mekwall/is-install-needed/blob/master/LICENSE)
[![Build Status](https://img.shields.io/circleci/project/github/mekwall/is-install-needed.svg?style=flat-square)](https://circleci.com/gh/mekwall/is-install-needed)
[![Coverage](https://img.shields.io/codecov/c/github/mekwall/is-install-needed/master.svg?style=flat-square)](https://codecov.io/github/mekwall/is-install-needed?branch=master)
[![Dependencies](https://img.shields.io/librariesio/github/mekwall/is-install-needed.svg?style=flat-square)](https://github.com/mekwall/is-install-needed)

A simple devtool that tells you if you need to run install or not. It does so by checking if the lock file of your preferred package manager has changed. Supports the most popular package managers out there: [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) and [pnpm](https://pnpm.js.org/).

## Installation

Install the `is-install-needed` package with your preferred package manager.

Add `is-install-needed --postinstall` to your postscript to automatically write a check file after install.

## Usage

### CLI

```bash
$ is-install-needed
```

It will automatically look for yarn.lock, package-lock.json and shrinkwrap.yaml when no preferred package manager is provided.

| Flag            | Available options | Description               |
| --------------- | ----------------- | ------------------------- |
| `--prefer`      | npm, yarn or pnpm | Preferred package manager |
| `--cwd`         | \<path>           | Current working directory |
| `--postinstall` |                   | Postinstall script        |

### Programmatic API

#### Check if install is needed

```javascript
import { isInstallNeeded } from 'is-install-needed';

async () => {
  const isNeeded = await isInstallNeeded();
  if (result) {
    console.error('You need to run install');
    process.exit(1);
  }
};
```

#### Find closest lock file

```javascript
import { findClosestLockfile } from 'is-install-needed';

async () => {
  const lockfile = await findClosestLockfile();
  console.log(lockfile); // > /path/to/package/.yarn.lock
};
```
