var test = require('tape')
var from = require('from2')
var callback = require('callback-stream')
var group = require('./')
var merge = require('merge-sorted-stream')

test('group', function (t) {
  group(from.obj([1, 1, 2, 2, 3])).pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      [1, 1],
      [2, 2],
      [3]
    ])
    t.end()
  }))
})
test('group by custom key', function (t) {
  group(from.obj([
    {id: 1}, {id: 1}, {id: 2}, {id: 3}, {id: 3}
  ]), function (data) {
    return data.id
  }).pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      [ { id: 1 }, { id: 1 } ],
      [ { id: 2 } ],
      [ { id: 3 }, { id: 3 } ]
    ])
    t.end()
  }))
})

test('merge sort and group by custom key', function (t) {
  function toKey (data) {
    return data.id
  }

  var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
  var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
  var c = from.obj([{id: 3}, {id: 5}, {id: 6}])

  group([a, b, c].reduce(function (a, b) {
    return merge(a, b, toKey)
  }), toKey)
  .pipe(callback.obj(function (err, data) {
    t.notOk(err)
    t.deepEqual(data, [
      [{id: 1}, {id: 1}],
      [{id: 2}],
      [{id: 3}, {id: 3}],
      [{id: 5}],
      [{id: 6}, {id: 6}, {id: 6}]
    ], 'merge join')
    t.end()
  }))
})
