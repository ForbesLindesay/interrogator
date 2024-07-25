let inquirerCache: Promise<typeof import('inquirer').default> | undefined;
async function inquirer() {
  return await (inquirerCache ||
    (inquirerCache = import('inquirer').then((i) => i.default)));
}
// end inquirer import

async function typedPrompt<T>(
  question: import('inquirer').DistinctQuestion<{value: T}> & {name: 'value'},
) {
  const {prompt} = await inquirer();
  return (
    await prompt(
      Object.fromEntries(
        Object.entries(question).filter(([, value]) => value !== undefined),
      ),
    )
  ).value;
}

async function replaceSeparators<T>(
  choices: readonly T[],
): Promise<(T extends Separator ? import('inquirer').default.Separator : T)[]> {
  const i = await inquirer();
  return choices.map((c): any =>
    c instanceof Separator ? new i.Separator(c.line) : c,
  );
}

export class Separator {
  readonly type: 'separator';
  readonly line: string | undefined;
  constructor(line?: string) {
    this.type = 'separator';
    this.line = line;
  }
}

export type ExpandChoiceObject<T> =
  | {
      readonly value: T;
      readonly key: string;
      readonly name: string;
      readonly short?: string;
    }
  | Separator;
export type CheckboxChoiceObject<T> =
  | {
      readonly value: T;
      readonly checked: boolean;
      readonly name: string;
      readonly short?: string;
    }
  | Separator;
export type ChoiceObject<T> =
  | {readonly value: T; readonly name: string; readonly short?: string}
  | Separator;
export type Choice<T> = ChoiceObject<T> | Extract<T, string>;

function getDefaultValue(choices: readonly any[], defaultValue: any) {
  if (defaultValue === undefined) return undefined;
  if (choices.every((c) => typeof c === 'string')) return defaultValue;
  const result = choices.findIndex((c) => c.value === defaultValue);
  if (result === -1) return undefined;
  return result;
}

export async function list<T extends string>(
  message: string,
  choices: ReadonlyArray<T>,
  defaultValue?: T,
): Promise<T>;
export async function list<T>(
  message: string,
  choices: ReadonlyArray<ChoiceObject<T>>,
  defaultValue?: T,
): Promise<T>;
export async function list<T>(
  message: string,
  choices: ReadonlyArray<Choice<T>>,
  defaultValue?: T,
): Promise<T> {
  return await typedPrompt({
    type: 'list',
    name: 'value',
    message,
    choices: await replaceSeparators(choices),
    default: getDefaultValue(choices, defaultValue),
  });
}

export async function rawList<T extends string>(
  message: string,
  choices: ReadonlyArray<T>,
  defaultValue?: T,
): Promise<T>;
export async function rawList<T>(
  message: string,
  choices: ReadonlyArray<ChoiceObject<T>>,
  defaultValue?: T,
): Promise<T>;
export async function rawList<T>(
  message: string,
  choices: ReadonlyArray<Choice<T>>,
  defaultValue?: T,
): Promise<T> {
  return await typedPrompt({
    type: 'rawlist',
    name: 'value',
    message,
    choices: await replaceSeparators(choices),
    default: getDefaultValue(choices, defaultValue),
  });
}

export async function expand<T>(
  message: string,
  choices: ReadonlyArray<ExpandChoiceObject<T>>,
  defaultValue?: T,
): Promise<T> {
  return await typedPrompt({
    type: 'expand',
    name: 'value',
    message,
    choices: await replaceSeparators(choices),
    default: getDefaultValue(choices, defaultValue),
  });
}

export async function checkboxes<T>(
  message: string,
  choices: ReadonlyArray<CheckboxChoiceObject<T>>,
): Promise<T[]> {
  return await typedPrompt({
    type: 'checkbox',
    name: 'value',
    message,
    choices: await replaceSeparators(choices),
  });
}

export async function confirm(
  message: string,
  defaultValue: boolean = true,
): Promise<boolean> {
  return await typedPrompt({
    type: 'confirm',
    name: 'value',
    message,
    default: defaultValue,
  });
}

export async function input(
  message: string,
  defaultValue?: string,
  validate?: (value: string) => true | string,
): Promise<string> {
  return await typedPrompt({
    type: 'input',
    name: 'value',
    message,
    default: defaultValue,
    validate,
  });
}

export async function password(
  message: string,
  defaultValue?: string,
  validate?: (value: string) => true | string,
): Promise<string> {
  return await typedPrompt({
    type: 'password',
    name: 'value',
    message,
    default: defaultValue,
    validate,
  });
}

export async function editor(
  message: string,
  defaultValue: string = '',
): Promise<string> {
  return await typedPrompt({
    type: 'editor',
    name: 'value',
    message,
    default: defaultValue,
  });
}
