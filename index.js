var iterate = require('stream-iterate')
var from = require('from2')
var merge = require('./merge')

function defaultKey (val) {
  return val.key || val
}

module.exports = function join () {
  var args = Array.prototype.slice.call(arguments)
  var toKey = defaultKey
  if (typeof args[args.length - 1] === 'function') {
    toKey = args.pop()
  }

  // merge sort all streams into one stream
  var fromStream = args.reduce(function (a, b) {
    return merge(a, b, toKey)
  })

  // group into arrays by key
  var read = iterate(fromStream)
  var curr, stack
  var stream = from.obj(function loop (size, cb) {
    read(function (err, data, next) {
      if (err) return cb(err)

      if (!data) {
        if (stack && stack.length > 0) cb(null, stack)
        stack = null
        return cb(null, null)
      }

      next()
      var key = toKey(data)

      if (key === curr) {
        stack.push(data)
      } else {
        if (stack && stack.length > 0) cb(null, stack)
        stack = [data]
        curr = key
      }

      loop(size, cb)
    })
  })

  stream.on('close', function () {
    if (fromStream.destroy) fromStream.destroy()
  })

  return stream
}
