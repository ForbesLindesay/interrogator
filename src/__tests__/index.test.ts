import {readFileSync} from 'fs';
import getHash from './getDirHash';

test('check manaul tests have been run via `yarn test`', () => {
  const actual = getHash(__dirname + '/../');
  expect(actual).toBe(
    readFileSync(__dirname + '/../../test-hash-cjs.txt', 'utf8'),
  );
  expect(actual).toBe(
    readFileSync(__dirname + '/../../test-hash-cjs-interop.txt', 'utf8'),
  );
  expect(actual).toBe(
    readFileSync(__dirname + '/../../test-hash-esm.txt', 'utf8'),
  );
});
