const inquirer = require('inquirer')
const fs = require('fs')
const downloadAndCreate = require('../utils/download-and-create.js')
const { join } = require('path')
const axios = require('axios')
const chalk = require('chalk')

module.exports = async function (commander) {
  commander.command('create').action(async function () {
    const { dirname } = await inquirer.prompt({
      type: 'input',
      message: 'enter your project name',
      name: 'dirname',
      validate (targetName) {
        if (!targetName) return 'invalid name'
        const hasAlreadyCreateFolder = fs.existsSync(join(process.cwd(), targetName))
        const hasAlreadyCreateZip = fs.existsSync(join(process.cwd(), `${targetName}.zip`))
        if (hasAlreadyCreateFolder || hasAlreadyCreateZip) return 'name already exists'
        return true
      }
    })

    const { data: menu } = await axios.get(global.baseURL + 'menu')

    const { value: ch } = await inquirer.prompt(menu)

    try {
      console.log('5...')
      await downloadAndCreate.downLoad(ch.template, dirname, ch.child)
      console.log('4...')
      await downloadAndCreate.unzip(dirname, ch.child)
      console.log('3...')
      downloadAndCreate.delZipFile(dirname, ch.child)
      console.log('2...')
      await downloadAndCreate.initPackageJson(dirname, ch.child)
      console.log('1...')
      console.log(chalk.green('模版创建成功，请进入对应目录执行 npm i 安装依赖'))
    } catch (error) {
      console.error(
        chalk.red(error)
      )
    }
  })
}
