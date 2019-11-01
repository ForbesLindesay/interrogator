import {prompt, Separator} from 'inquirer';

export {Separator};
type SeparatorInstance = typeof Separator extends (new () => infer Instance)
  ? Instance
  : never;
export type Separator = SeparatorInstance;

export type ExpandChoiceObject<T> =
  | {
      readonly value: T;
      readonly key: string;
      readonly name: string;
      readonly short?: string;
    }
  | SeparatorInstance;
export type CheckboxChoiceObject<T> =
  | {
      readonly value: T;
      readonly checked: boolean;
      readonly name: string;
      readonly short?: string;
    }
  | SeparatorInstance;
export type ChoiceObject<T> =
  | {readonly value: T; readonly name: string; readonly short?: string}
  | SeparatorInstance;
export type Choice<T> = ChoiceObject<T> | Extract<T, string>;

function getValue(p: any): any {
  return p.value;
}

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
  return getValue(
    await prompt([
      {
        type: 'list',
        name: 'value',
        message,
        choices,
        default: getDefaultValue(choices, defaultValue),
      },
    ]),
  );
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
  return getValue(
    await prompt([
      {
        type: 'rawlist',
        name: 'value',
        message,
        choices,
        default: getDefaultValue(choices, defaultValue),
      },
    ]),
  );
}

export async function expand<T>(
  message: string,
  choices: ReadonlyArray<ExpandChoiceObject<T>>,
  defaultValue?: T,
): Promise<T> {
  return getValue(
    await prompt([
      {
        type: 'expand',
        name: 'value',
        message,
        choices,
        default: getDefaultValue(choices, defaultValue),
      },
    ]),
  );
}

export async function checkboxes<T>(
  message: string,
  choices: ReadonlyArray<CheckboxChoiceObject<T>>,
): Promise<T[]> {
  return getValue(
    await prompt([
      {
        type: 'checkbox',
        name: 'value',
        message,
        choices,
      },
    ]),
  );
}

export async function confirm(
  message: string,
  defaultValue: boolean = true,
): Promise<boolean> {
  return getValue(
    await prompt([
      {
        type: 'confirm',
        name: 'value',
        message,
        default: defaultValue,
      },
    ]),
  );
}

export async function input(
  message: string,
  defaultValue?: string,
  validate?: (value: string) => true | string,
): Promise<string> {
  return getValue(
    await prompt([
      {
        type: 'input',
        name: 'value',
        message,
        default: defaultValue,
        validate,
      },
    ]),
  );
}

export async function password(
  message: string,
  defaultValue?: string,
  validate?: (value: string) => true | string,
): Promise<string> {
  return getValue(
    await prompt([
      {
        type: 'password',
        name: 'value',
        message,
        default: defaultValue,
        validate,
      },
    ]),
  );
}

export async function editor(
  message: string,
  defaultValue: string = '',
): Promise<string> {
  return getValue(
    await prompt([
      {
        type: 'editor',
        name: 'value',
        message,
        default: defaultValue,
      },
    ]),
  );
}
