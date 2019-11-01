# interrogator

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/interrogator.svg)](https://greenkeeper.io/)

A collection of common interactive command line user interfaces

## Installation

```
yarn add @forbeslindesay/interrogator
```

## Usage

```ts
import * as interrogator from '@forbeslindesay/interrogator';

const answer = await interrogator.list('Pick an option', [
  'a',
  'b',
  'c',
] as const);
```
