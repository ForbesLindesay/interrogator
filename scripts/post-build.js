const {resolve} = require('path');
const {readFileSync, writeFileSync, unlinkSync, mkdirSync} = require('fs');

unlinkSync(`${__dirname}/../lib/index.js.map`);

const HASH_INPUT_DIRECTORY = resolve(__dirname + '/../src');

const input = `${__dirname}/../lib/index.js`;
const outputMjs = `${__dirname}/../lib/index.mjs`;

const inputSrc = readFileSync(input, `utf8`);

if (!/\bexport\b/.test(inputSrc)) {
  throw new Error(`input does not appear to be an ES module`);
}

const esmOutput =
  `import inquirer from 'inquirer';\n` +
  inputSrc
    .split(`end inquirer import`)[1]
    .replace(/await inquirer\(\)/g, `inquirer`)
    .replace(/await replaceSeparators/g, `replaceSeparators`)
    .replace(/async function replaceSeparators/, `function replaceSeparators`);
writeFileSync(outputMjs, esmOutput);

const commonJsExports = [];
let commonJsOutput =
  `"use strict";\n` +
  `Object.defineProperty(exports, "__esModule", { value: true });\n` +
  inputSrc.replace(
    /export ((?:class |async |function )+)([^ (]+)/g,
    (_, prefix, name) => {
      commonJsExports.push(name);
      return prefix + name;
    },
  );
commonJsOutput += `\n${commonJsExports
  .map((e) => `exports.${e} = ${e};`)
  .join(`\n`)}\n`;

writeFileSync(input, commonJsOutput);

if (/\bexport\b/.test(commonJsOutput)) {
  throw new Error(`Failed to fully convert commonJS output`);
}

const getDirHash = readFileSync(
  `${__dirname}/../src/__tests__/getDirHash.ts`,
  `utf8`,
);
const manualTests = readFileSync(
  `${__dirname}/../src/__tests__/manual-test.ts`,
  `utf8`,
);

for (const mode of [`cjs`, `cjs-interop`, `esm`]) {
  mkdirSync(`${__dirname}/../tests/${mode}/src`, {recursive: true});
  writeFileSync(`${__dirname}/../tests/${mode}/src/getDirHash.ts`, getDirHash);
  writeFileSync(
    `${__dirname}/../tests/${mode}/src/manual-test.ts`,
    manualTests
      .replace(/from \'\.\.\'/g, `from 'interrogator'`)
      .replace(
        /HASH_OUTPUT_FILENAME = [^;]+;/g,
        `HASH_OUTPUT_FILENAME = ${JSON.stringify(
          resolve(`${__dirname}/../test-hash-${mode}.txt`),
        )};`,
      )
      .replace(
        /HASH_INPUT_DIRECTORY = [^;]+;/g,
        `HASH_INPUT_DIRECTORY = ${JSON.stringify(HASH_INPUT_DIRECTORY)};`,
      ),
  );
  writeFileSync(
    `${__dirname}/../tests/${mode}/package.json`,
    JSON.stringify(
      {
        name: `interrogator-${mode}`,
        private: true,
        type: mode === 'esm' ? 'module' : undefined,
        scripts: {
          build: 'tsc',
        },
        dependencies: {
          interrogator: '../../interrogator-0.0.0.tgz',
        },
        devDependencies: {
          typescript: '^4.9.4',
        },
      },
      null,
      `  `,
    ),
  );
  writeFileSync(
    `${__dirname}/../tests/${mode}/tsconfig.json`,
    JSON.stringify(
      {
        compilerOptions: {
          isolatedModules: true,
          module: mode === 'esm' ? 'ES2020' : 'CommonJS',
          moduleResolution: 'node',
          target: 'ES2019',
          lib: ['es2019'],
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          declaration: true,
          sourceMap: true,
          outDir: 'lib',
          forceConsistentCasingInFileNames: true,
          experimentalDecorators: true,
          esModuleInterop: mode === `cjs-interop`,
        },
        include: ['./src/**/*'],
      },
      null,
      `  `,
    ),
  );
}
