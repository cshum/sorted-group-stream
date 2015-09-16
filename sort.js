var iterate = require('stream-iterate')
var from = require('from2')

// merge sort taken from
// https://github.com/mafintosh/stream-iterate/blob/master/test.js

module.exports = function sort (streamA, streamB, toKey) {
  var readA = iterate(streamA, toKey)
  var readB = iterate(streamB)

  var stream = from.obj(function next (push) {
    readA(function (err, dataA, nextA) {
      if (err) return push(err)
      readB(function (err, dataB, nextB) {
        if (err) return push(err)

        if (!dataA && !dataB) return push(null, null)

        var keyA = dataA ? toKey(dataA) : undefined
        var keyB = dataB ? toKey(dataB) : undefined

        if (!dataB || keyA < keyB) {
          push(null, dataA)
          nextA()
          return next()
        }

        if (!dataA || keyA > keyB) {
          push(null, dataB)
          nextB()
          return next()
        }

        push(null, dataA)
        push(null, dataB)
        nextA()
        nextB()
        next()
      })
    })
  })

  stream.on('close', function () {
    if (streamA.destroy) streamA.destroy()
    if (streamB.destroy) streamB.destroy()
  })

  return stream
}
