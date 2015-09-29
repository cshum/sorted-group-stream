# group-stream

Group a sorted stream by key.

[![Build Status](https://travis-ci.org/cshum/group-stream.svg?branch=master)](https://travis-ci.org/cshum/group-stream)

```
npm install group-stream
```

### group([toKey], [options])
A transform stream that groups objects by key.

Keys are mapped by `value.key` or `value` itself. Add a `toKey` function if you need custom key mapping.

By default values are grouped into arrays. Use `options.extend = true` for object extend grouping.

```js
var group = require('group-stream')
var from = require('from2')

var stream = from.obj([1, 1, 2, 2, 3])

stream.pipe(group()).pipe(...)

// result
[1, 1]
[2, 2]
[3]
```

Combine with [sorted-merge-stream](https://github.com/cshum/sorted-merge-stream),
custom key mapping, object extend:

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
.pipe(group(toKey, {extend: true}))
.pipe(...)

// result
{id: 1, a: true, b: true}
{id: 2, b: true}
{id: 3, a: true, c: true}
{id: 5, c: true}
{id: 6, a: true, b: true, c: true}

```

## License

MIT

