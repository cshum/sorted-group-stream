var test = require('tape')
var from = require('from2')
var callback = require('callback-stream')
var group = require('./')

/*
test('merge', function (t) {
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

merge sort all streams into one stream
var sorted = joins.reduce(function (a, b) {
  return merge(a, b, toKey)
})

test('merge-join array', function (t) {
  function toKey (data) {
    return data.id
  }
  var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
  var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
  var c = from.obj([{id: 3}, {id: 5}, {id: 6}])

  join([a, b, c], toKey).pipe(callback.obj(function (err, data) {
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
*/

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
