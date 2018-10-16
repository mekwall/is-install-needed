# is-install-needed

[![Build Status](https://img.shields.io/circleci/project/github/mekwall/is-install-needed.svg)](https://circleci.com/gh/mekwall/is-install-needed)

This is a simple tool that checks if the lock file has changed (supports both Yarn and npm) so you know if you need to run install.

## Installation

### npm

```bash
$ npm install -g is-install-needed
```

### yarn

```bash
$ yarn global add is-install-needed
```

## Usage

### CLI

```bash
$ is-install-needed
```

By default it looks for both yarn.lock and package-lock.json.

| Flag     | Description                     |
| -------- | ------------------------------- |
| `--yarn` | Only look for yarn.lock         |
| `--npm`  | Only look for package-lock.json |

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
