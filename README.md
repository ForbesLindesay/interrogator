# interrogator

A collection of common interactive command line user interfaces

## Installation

```
yarn add interrogator
```

## Usage

```ts
import * as interrogator from 'interrogator';

const answer = await interrogator.list('Pick an option', [
  'a',
  'b',
  'c',
] as const);
```
