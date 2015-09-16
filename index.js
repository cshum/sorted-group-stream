var iterate = require('stream-iterate')
var from = require('from2')
var sort = require('./sort')

function defaultKey (val) {
  return val.key || val
}

module.exports = function join () {
  var args = Array.prototype.slice(arguments)
  var toKey = defaultKey
  if (typeof args[args.length - 1] === 'function') {
    toKey = args.pop()
  }

  // merge sort all streams into one stream
  var fromStream = args.reduce(function (a, b) {
    return sort(a, b, toKey)
  })

  // group into arrays by key
  var read = iterate(fromStream)
  var key, stack
  var stream = from.obj(function next (push) {
    read(function (err, data, fromNext) {
      if (err) return push(err)
      if (!data) {
        if (stack && stack.length > 0) push(null, stack)
        push(null, null)
      } else {
        if (toKey(data) === key) {
          stack.push(data)
        } else {
          if (stack && stack.length > 0) push(null, stack)
          stack = [data]
          key = toKey(data)
        }
        next()
        fromNext()
      }
    })
  })

  stream.on('close', function () {
    if (fromStream.destroy) fromStream.destroy()
  })

  return stream
}
