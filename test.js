var test = require('tape')
var from = require('from2')
var callback = require('callback-stream')
var join = require('./')
var merge = require('./merge')

test('merge sort', function (t) {
  var a = from.obj(['a', 'b', 'd', 'e', 'g', 'h'])
  var b = from.obj(['b', 'c', 'f'])
  merge(a, b).pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      'a', 'b', 'b', 'c', 'd', 'e', 'f', 'g', 'h'
    ], 'merge sort')
    t.end()
  }))
})
test('join', function (t) {
  join(from.obj([
    {key: 1}, {key: 1}, {key: 2}, {key: 3}, {key: 3}
  ]))
  .pipe(callback.obj(function (err, arr) {
    t.deepEqual(arr, [
      [ { key: 1 }, { key: 1 } ],
      [ { key: 2 } ],
      [ { key: 3 }, { key: 3 } ]
    ], 'grouping')
    t.end()
  }))
})
