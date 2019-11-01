import * as assert from 'assert';
import {writeFileSync} from 'fs';
import * as prompt from '../';
import getHash from './getDirHash';

function expectType<T>(value: T) {
  return value;
}
async function run() {
  console.info('# List');

  console.info(
    'This list should contain three strings, "One", "Two", "Three". The default should be "Three"',
  );

  const resultA = await prompt.list(
    'Select "Two"',
    ['One', 'Two', 'Three'],
    'Three',
  );
  expectType<'One' | 'Two' | 'Three'>(resultA);
  assert.equal(resultA, 'Two');

  console.info(
    'This list should contain three strings, "One", "Two", "Three". The default should be "Three"',
  );

  const resultB = await prompt.list(
    'Select "Two"',
    [
      {value: 1, name: 'One'},
      {value: 2, name: 'Two'},
      {value: 3, name: 'Three'},
    ] as const,
    3,
  );
  expectType<1 | 2 | 3>(resultB);
  assert.equal(resultB, 2);

  console.info('# Raw List');

  console.info(
    'This list should contain three strings, "One", "Two", "Three". The default should be "Three"',
  );

  const resultC = await prompt.rawList(
    'Select "Two"',
    ['One', 'Two', 'Three'],
    'Three',
  );
  expectType<'One' | 'Two' | 'Three'>(resultC);
  assert.equal(resultC, 'Two');

  console.info(
    'This list should contain three strings, "One", "Two", "Three". The default should be "Three"',
  );

  const resultD = await prompt.rawList(
    'Select "Two"',
    [
      {value: 1, name: 'One'},
      {value: 2, name: 'Two'},
      {value: 3, name: 'Three'},
    ] as const,
    3,
  );
  expectType<1 | 2 | 3>(resultD);
  assert.equal(resultD, 2);

  console.info('# Expand');

  console.info(
    'This list should present an expand list with abc and a defualt of C. It should expand into "One", "Two", "Three"',
  );

  const resultE = await prompt.expand(
    'Select "b"',
    [
      {value: 1, name: 'One', key: 'a'},
      {value: 2, name: 'Two', key: 'b'},
      {value: 3, name: 'Three', key: 'c'},
    ] as const,
    3,
  );
  expectType<1 | 2 | 3>(resultE);
  assert.equal(resultE, 2);

  console.info('# Checkboxes');

  console.info('This should present 5 options');
  const resultF = await prompt.checkboxes('Select the "apple" and "bannanna"', [
    {value: 1, checked: false, name: 'Apple'},
    {value: 2, checked: true, name: 'Bannanna'},
    {value: 3, checked: false, name: 'Carrot'},
    {value: 4, checked: false, name: 'Mushroom'},
  ] as const);
  expectType<(1 | 2 | 3 | 4)[]>(resultF);
  assert.deepEqual(resultF, [1, 2]);

  writeFileSync(
    __dirname + '/../../test-hash.txt',
    getHash(__dirname + '/../'),
  );
}

run().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
