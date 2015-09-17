# group-stream

Group a sorted stream by key.

[![Build Status](https://travis-ci.org/cshum/group-stream.svg?branch=master)](https://travis-ci.org/cshum/group-stream)

```
npm install group-stream
```

### group(stream, [toKey])
Group a sorted stream by key.
By default keys are mapped by `value.key` or `value` itself. Add a `toKey` function if you need custom key mapping.

```js
var group = require('group-stream')
var from = require('from2')

var stream = group(from.obj([1, 1, 2, 2, 3]))

stream.pipe(...)

// result
[1, 1]
[2, 2]
[3]
```

Combine with [merge-sorted-stream](https://github.com/cshum/merge-sorted-stream) with custom key mapping:

```js
var group = require('group-stream')
var merge = require('merge-sorted-stream')
var from = require('from2')

var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
var c = from.obj([{id: 3}, {id: 5}, {id: 6}])

function toKey (data) {
  return data.id
}

var stream = group([a, b, c].reduce(function (a, b) {
  return merge(a, b, toKey)
}), toKey)

stream.pipe(...)

// result
[{id: 1}, {id: 1}]
[{id: 2}]
[{id: 3}, {id: 3}]
[{id: 5}]
[{id: 6}, {id: 6}, {id: 6}]

```

## License

MIT

