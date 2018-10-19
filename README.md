# is-install-needed

[![GitHub license](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/mekwall/is-install-needed/blob/master/LICENSE)
[![Build Status](https://img.shields.io/circleci/project/github/mekwall/is-install-needed.svg?style=flat-square)](https://circleci.com/gh/mekwall/is-install-needed)
[![Coverage](https://img.shields.io/codecov/c/github/mekwall/is-install-needed/master.svg?style=flat-square)](https://codecov.io/github/mekwall/is-install-needed?branch=master)
[![Dependencies](https://img.shields.io/librariesio/github/mekwall/is-install-needed.svg?style=flat-square)](https://github.com/mekwall/is-install-needed)

This is a simple tool that checks if the lock file has changed (supports Yarn, npm and pnpm) so you know if you need to run install.

## Installation

Install globally with `npm`, `yarn` or `pnpm` if you want to use the cli, or locally if you only want to use it programatically.

## Usage

### CLI

```bash
$ is-install-needed
```

By default it will automatically look for yarn.lock, package-lock.json and shrinkwrap.yaml.

| Flag     | Description                     |
| -------- | ------------------------------- |
| `--yarn` | Only look for yarn.lock         |
| `--npm`  | Only look for package-lock.json |
| `--pnpm` | Only look for shrinkwrap.yaml   |

### Programmatic API

```javascript
import { isInstallNeeded } from 'is-install-needed';

async function check() {
  const isNeeded = await isInstallNeeded('./yarn.lock', '.lockhash');
  if (result) {
    // Install packages
  }
}
```
