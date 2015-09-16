var test = require('tape')
var from = require('from2')
var callback = require('callback-stream')
var join = require('./')
var merge = require('./merge')

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

test('join', function (t) {
  join(from.obj([
    {key: 1}, {key: 1}, {key: 2}, {key: 3}, {key: 3}
  ]))
  .pipe(callback.obj(function (err, arr) {
    t.notOk(err)
    t.deepEqual(arr, [
      [ { key: 1 }, { key: 1 } ],
      [ { key: 2 } ],
      [ { key: 3 }, { key: 3 } ]
    ], 'join')
    t.end()
  }))
})

test('merge-join', function (t) {

  function toKey (data) {
    return data.id
  }
  var a = from.obj([{id: 1}, {id: 3}, {id: 6}])
  var b = from.obj([{id: 1}, {id: 2}, {id: 6}])
  var c = from.obj([{id: 3}, {id: 5}, {id: 6}])

  join(a, b, c, toKey).pipe(callback.obj(function (err, data) {
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
