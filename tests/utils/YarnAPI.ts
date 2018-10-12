import * as cp from 'child_process';
import * as os from 'os';
import * as stream from 'stream';
import * as fs from 'fs-extra';
import * as path from 'path';

interface Options {
  pkgs?: string[];
  extraArgs?: string[];
}

export class YarnAPI {
  public proc: cp.ChildProcess | undefined = undefined;
  public stdout = new stream.PassThrough();
  public stderr = new stream.PassThrough();
  constructor(public cwd = process.cwd(), public env = process.env) {}

  private exec(cmd: string, options: Options) {
    if (this.proc) {
      return Promise.reject(new Error('Yarn is already running'));
    }
    return new Promise((resolve, reject) => {
      let args = [cmd];
      if (options.pkgs) {
        args = args.concat(options.pkgs);
      }
      if (options.extraArgs) {
        args = args.concat(options.extraArgs);
      }
      this.proc = cp.spawn(
        os.platform() === 'win32' ? 'yarn.cmd' : 'yarn',
        args,
        {
          cwd: this.cwd,
          env: this.env,
          stdio: 'pipe',
        }
      );

      let totalData = '';
      this.proc.stdout.on('data', (data) => {
        totalData += data.toString();
        this.stdout.write(data);
      });

      let totalErr = '';
      this.proc.stderr.on('data', (data) => {
        totalErr += data;
        this.stderr.write(data);
      });

      this.proc.on('close', (code) => {
        if (code !== 0) {
          reject(totalErr);
        } else {
          resolve(totalData);
        }
        this.proc = undefined;
      });
    });
  }

  public install(extraArgs?: string[]) {
    return this.exec('install', {
      extraArgs,
    });
  }

  public add(pkgs?: string[], extraArgs?: string[]) {
    return this.exec('add', {
      pkgs,
      extraArgs,
    });
  }

  public remove(pkgs: string[]) {
    return this.exec('remove', { pkgs });
  }

  public async rmmods() {
    try {
      await fs.remove(path.join(this.cwd, 'node_modules'));
    } catch (e) {
      // Do nothing
    }
    return true;
  }

  public async rmlockfile() {
    try {
      await fs.remove(path.join(this.cwd, 'yarn.lock'));
    } catch (e) {
      // Do nothing
    }
    return true;
  }
}
