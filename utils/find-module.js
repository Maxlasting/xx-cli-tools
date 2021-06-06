const { join } = require('path')

module.exports = function findModule (name, arr = ['.']) {
  let m = null
  try {
    m = require(join(process.cwd(), arr.join('/'), 'node_modules', name))
  } catch (error) {
    if (arr.length < 20) {
      arr.push('..')
      m = findModule(name, arr)
    }
  }
  return m
}
