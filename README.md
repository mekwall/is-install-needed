# is-install-needed

[![license](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/mekwall/is-install-needed/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/is-install-needed.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/is-install-needed)
[![dependencies](https://img.shields.io/librariesio/github/mekwall/is-install-needed.svg?style=flat-square)](https://github.com/mekwall/is-install-needed)
![types](https://img.shields.io/npm/types/is-install-needed.svg?style=flat-square&logo=typescript)
[![build](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fmekwall%2Fis-install-needed%2Fbadge%3Fref%3Dmaster&label=build&style=flat-square)](https://actions-badge.atrox.dev/mekwall/is-install-needed/goto?ref=master)
[![coverage](https://img.shields.io/codecov/c/github/mekwall/is-install-needed?style=flat-square)](https://codecov.io/github/mekwall/is-install-needed?branch=master)
[![quality](https://img.shields.io/lgtm/grade/javascript/github/mekwall/is-install-needed?style=flat-square)](https://lgtm.com/projects/g/mekwall/is-install-needed/?mode=list)

A simple devtool that tells you if you need to run install or not. It does so by checking if the lock file of your preferred package manager has changed. Supports the most popular package managers out there: [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) (v1 and v2) and [pnpm](https://pnpm.js.org/).

## Installation

Install the `is-install-needed` package with your preferred package manager.

Add `is-install-needed --postinstall` to your postscript to automatically write a check file after install.

## Usage

### CLI

```bash
$ is-install-needed
```

It will automatically look for yarn.lock, package-lock.json and pnpm-lock.yaml when no preferred package manager is provided.

| Flag            | Available options | Description               |
| --------------- | ----------------- | ------------------------- |
| `--prefer`      | npm, yarn or pnpm | Preferred package manager |
| `--cwd`         | \<path>           | Current working directory |
| `--postinstall` |                   | Postinstall script        |

### Programmatic API

#### Check if install is needed

```javascript
import { isInstallNeeded } from "is-install-needed";

async () => {
  const isNeeded = await isInstallNeeded();
  if (result) {
    console.error("You need to run install");
    process.exit(1);
  }
};
```

#### Find closest lock file

```javascript
import { findClosestLockfile } from "is-install-needed";

async () => {
  const lockfile = await findClosestLockfile();
  console.log(lockfile); // > /path/to/package/.yarn.lock
};
```
