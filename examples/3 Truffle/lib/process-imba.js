var imba = require('imba/compiler')

module.exports = function (contents, file, config, process, callback) {
  try {
    var compiled = imba.compile(contents)
    callback(null, compiled.js)
  } catch (e) {
    callback(e)
  }
}
