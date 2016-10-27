var through = require('through2')

function defaultKey (val) {
  return val.key || val
}

module.exports = function group (toKey) {
  if (typeof toKey !== 'function') {
    toKey = defaultKey
  }
  var curr, value
  return through.obj(function (data, enc, cb) {
    var next = toKey(data)
    if (curr !== next) {
      if (value) this.push({ key: curr, value: value })
      value = []
      curr = next
    }
    value.push(data)
    cb()
  }, function (cb) {
    if (value) this.push({ key: curr, value: value })
    cb()
  })
}
