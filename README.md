# only-last

Tiny (less than 1kb), zero dependency helper for race conditions on user input.

## TL;DR

```ts
import { OnlyLast } from 'only-last'

const executor = new OnlyLast()

const search = async (query) => {
  const result = await executor.execute(() => api.getData(query))

  return result.data
}

// in other place

search('he').then(data => {
  // data is a result of search 'hello'
})

// wait 40 ms

search('hello').then(data => {
  // data is a result of search 'hello'
})
```

## Installation

```
yarn add only-last
```

Or if you prefer npm:

```
npm i only-last
```

## Usage

You should create new executor for every function, which you want to wrap.
```ts
import { OnlyLast } from 'only-last'

const executorForSearch = new OnlyLast()
const executorForFilter = new OnlyLast()
// etc.
```

Then, just use executor in your function:
```ts
const search = (query) =>
  executor.execute(() => {
    // do something async and really long...
  })
```

All race conditions on user input solved, you are beatiful!

## One more thing

It is really tiny library, only 926 bytes. We use [size-limit](https://github.com/ai/size-limit) to control size.
