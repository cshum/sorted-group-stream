var iterate = require('stream-iterate')
var from = require('from2')
var merge = require('./merge')

function defaultKey (val) {
  return val.key || val
}

module.exports = function join (joins, toKey) {
  toKey = toKey || defaultKey

  // merge sort all streams into one stream
  var fromStream = joins.reduce(function (a, b) {
    return merge(a, b, toKey)
  })

  // group into arrays by key
  var read = iterate(fromStream)
  var ended = false
  var curr, stack
  var stream = from.obj(function loop (size, cb) {
    if (ended) return cb(null, null)
    read(function (err, data, next) {
      if (err) return cb(err)
      if (!data) {
        ended = true
        return cb(null, stack)
      }

      var key = toKey(data)

      if (key !== curr) {
        if (stack) {
          var arr = stack
          stack = null
          return cb(null, arr)
        } else {
          stack = []
          curr = key
        }
      }

      stack.push(data)
      next()
      loop(size, cb)
    })
  })

  stream.on('close', function () {
    if (fromStream.destroy) fromStream.destroy()
  })

  return stream
}
