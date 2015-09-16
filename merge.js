var iterate = require('stream-iterate')
var from = require('from2')

// merge sort taken from
// https://github.com/mafintosh/stream-iterate/blob/master/test.js

function defaultKey (val) {
  return val.key || val
}

module.exports = function merge (streamA, streamB, toKey) {
  var readA = iterate(streamA)
  var readB = iterate(streamB)

  toKey = toKey || defaultKey

  var stream = from.obj(function loop (size, push) {
    readA(function (err, dataA, nextA) {
      if (err) return push(err)
      readB(function (err, dataB, nextB) {
        if (err) return push(err)

        var keyA = dataA ? toKey(dataA) : undefined
        var keyB = dataB ? toKey(dataB) : undefined

        if (!keyA && !keyB) return push(null, null)

        if (!keyB || keyA < keyB) {
          nextA()
          push(null, dataA)
          return loop(size, push)
        }

        if (!keyA || keyA > keyB) {
          nextB()
          push(null, dataB)
          return loop(size, push)
        }

        nextA()
        nextB()
        push(null, dataA)
        push(null, dataB)
        loop(size, push)
      })
    })
  })

  stream.on('close', function () {
    if (streamA.destroy) streamA.destroy()
    if (streamB.destroy) streamB.destroy()
  })

  return stream
}
