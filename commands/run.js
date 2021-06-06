const findModule = require('../utils/find-module.js')

module.exports = function (commander) {
  commander.command('run [action] [cmds...]')
    .action((action, cmds) => {
      const isBuild = action === 'build'
      const isDev = action === 'dev'

      if (isBuild) {
        process.env.NODE_ENV = 'production'
      }

      if (isDev) {
        process.env.NODE_ENV = 'development'
      }

      for (let item of cmds) {
        const reg = /(\w+)=(\w+)/
        if (reg.test(item)) {
          const t = item.split('=')
          process.env[t[0]] = t[1]
        }
      }

      const bundler = findModule('xxplugin')

      if (!bundler) return

      bundler({ isBuild, isDev })
    })
}

