var iterate = require('stream-iterate')
var from = require('from2')

function defaultKey (val) {
  return val.key || val
}

module.exports = function group (sorted, toKey) {
  toKey = toKey || defaultKey

  var read = iterate(sorted)
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
    if (sorted.destroy) sorted.destroy()
  })

  return stream
}
