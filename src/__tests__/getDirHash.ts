import {createHash} from 'crypto';
import {readFileSync} from 'fs';
import {lsrSync} from 'lsr';

export default function getHash(dirname: string) {
  const hash = createHash('sha512');
  lsrSync(dirname, {
    filter: (entry) => entry.name[0] !== '.',
  }).forEach((entry) => {
    hash.update(entry.path);
    if (entry.isFile()) {
      hash.update(readFileSync(entry.fullPath));
    }
  });
  return hash.digest('hex');
}
