var through = require('through2')

// mutable extend
function extend (target) {
  for (var i = 1, l = arguments.length; i < l; i++) {
    var source = arguments[i]
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

function defaultKey (val) {
  return val.key || val
}

module.exports = function group (toKey, opts) {
  if (typeof toKey !== 'function') {
    opts = toKey
    toKey = defaultKey
  }
  opts = opts || {}

  var isExtend = !!opts.extend
  var target = null
  var curr
  return through.obj(function (data, enc, cb) {
    var key = toKey(data)
    if (key !== curr) {
      if (target) this.push(target)
      target = isExtend ? {} : []
      curr = key
    }
    if (isExtend) extend(target, data)
    else target.push(data)
    cb()
  }, function (cb) {
    if (target) this.push(target)
    cb()
  })
}
