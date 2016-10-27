# group-stream

Group a sorted stream by key.

[![Build Status](https://travis-ci.org/cshum/group-stream.svg?branch=master)](https://travis-ci.org/cshum/group-stream)

```
npm install group-stream
```

### `group([toKey])`
A transform stream that groups objects by key.

Keys are mapped by `value.key` or `value` itself. Pass `toKey` function for custom key mapping.

```js
var group = require('group-stream')
var from = require('from2')

var stream = from.obj([1, 1, 2, 2, 3])

stream.pipe(group()).pipe(...)

// result
{ key: 1, value: [1, 1] }
{ key: 2, value: [2, 2] }
{ key: 3, value: [3] }
```

Combine with [sorted-merge-stream](https://github.com/cshum/sorted-merge-stream) and custom key mapping:

```js
var group = require('group-stream')
var merge = require('sorted-merge-stream')
var from = require('from2')

var a = from.obj([{id: 1, a: true}, {id: 3, a: true}, {id: 6, a: true}])
var b = from.obj([{id: 1, b: true}, {id: 2, b: true}, {id: 6, b: true}])
var c = from.obj([{id: 3, c: true}, {id: 5, c: true}, {id: 6, c: true}])

function toKey (data) {
  return data.id
}

// sorted merge stream
var stream = [a, b, c].reduce(function (a, b) {
  return merge(a, b, toKey)
})

// group stream, object extend
stream
.pipe(group(toKey))
.pipe(...)

// result
{ key: 1, value: [{ id: 1, a: true }, { id: 1, b: true }] }
{ key: 2, value: [{ id: 2, b: true }] }
{ key: 3, value: [{ id: 3, a: true }, { id: 3, c: true }] }
{ key: 5, value: [{ id: 5, c: true }] }
{ key: 6, value: [{ id: 6, a: true }, { id: 6, b: true }, { id: 6, c: true }] }

```

## License

MIT

