var through = require('through2')

function defaultKey (val) {
  return val.key || val
}

module.exports = function group (toKey) {
  toKey = toKey || defaultKey

  var stack = []
  var curr
  return through.obj(function (data, enc, cb) {
    var key = toKey(data)
    if (key !== curr) {
      if (stack.length) this.push(stack)
      stack = []
      curr = key
    }
    stack.push(data)
    cb()
  }, function (cb) {
    if (stack.length > 0) this.push(stack)
    cb()
  })
}
