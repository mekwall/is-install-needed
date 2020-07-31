import crypto from "crypto";
import fs from "fs-extra";

export async function fileHash(filename: string, algorithm = "sha1") {
  const shasum = crypto.createHash(algorithm);
  try {
    shasum.update(await fs.readFile(filename));
    return shasum.digest("hex").toString();
  } catch (error) {
    throw new Error(`Could not get hash of file: ${filename}`);
  }
}
