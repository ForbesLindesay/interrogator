import * as assert from 'assert';
import {writeFileSync} from 'fs';
import * as prompt from '..';
import getHash from './getDirHash.js';

const HASH_OUTPUT_FILENAME = __dirname + '/../../test-hash.txt';
const HASH_INPUT_DIRECTORY = __dirname + '/../';

function expectType<T>(value: T) {
  return value;
}
async function run() {
  console.info('# Input');
  console.info('This should be an input with a default value of "hello".');
  const inputTest = await prompt.input('Enter "world"', 'hello');
  expectType<string>(inputTest);
  assert.equal(inputTest, 'world');
  console.info('This should be an input with validation.');
  const inputValidationTest = await prompt.input(
    'Enter "hello world"',
    '',
    (value) => value === 'hello world' || "Enter 'hello world'",
  );
  expectType<string>(inputValidationTest);
  assert.equal(inputValidationTest, 'hello world');

  console.info('# List');

  console.info(
    'This list should contain 4 options with a separator between them. The default option should be "Before 2".',
  );

  const separatorTest = await prompt.list(
    'Select "After 1"',
    [
      {value: 1, name: 'Before 1'},
      {value: 2, name: 'Before 2'},
      new prompt.Separator(`--custom-separator--`),
      {value: 3, name: 'After 1'},
      {value: 4, name: 'After 2'},
    ] as const,
    2,
  );
  expectType<1 | 2 | 3 | 4>(separatorTest);
  assert.equal(separatorTest, 3);

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

  console.info(
    'This should present 4 options and Banana should be selected by default.',
  );
  const resultF = await prompt.checkboxes('Select the "Apple" and "Banana"', [
    {value: 1, checked: false, name: 'Apple'},
    {value: 2, checked: true, name: 'Banana'},
    {value: 3, checked: false, name: 'Carrot'},
    {value: 4, checked: false, name: 'Mushroom'},
  ] as const);
  expectType<(1 | 2 | 3 | 4)[]>(resultF);
  assert.deepEqual(resultF, [1, 2]);

  writeFileSync(HASH_OUTPUT_FILENAME, getHash(HASH_INPUT_DIRECTORY));
}

run().catch((ex) => {
  console.error(ex);
  process.exit(1);
});
