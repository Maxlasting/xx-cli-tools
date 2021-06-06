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
      message: '请输入目标文件夹名称',
      name: 'dirname',
      validate (targetName) {
        if (!targetName) return '请输入合法的名称'
        const hasAlreadyCreateFolder = fs.existsSync(join(process.cwd(), targetName))
        const hasAlreadyCreateZip = fs.existsSync(join(process.cwd(), `${targetName}.zip`))
        if (hasAlreadyCreateFolder || hasAlreadyCreateZip) return '目标文件名称已存在'
        return true
      }
    })

    const { data: menu } = await axios.get(global.baseURL + 'menu')

    const { value: ch } = await inquirer.prompt(menu)

    try {
      console.log('开始下载模版文件压缩包')
      await downloadAndCreate.downLoad(ch.template, dirname, ch.child)
      console.log('压缩包下载完成，开始解压')
      await downloadAndCreate.unzip(dirname, ch.child)
      downloadAndCreate.delZipFile(dirname, ch.child)
      console.log('解压完成，开始初始化模版')
      await downloadAndCreate.initPackageJson(dirname, ch.child)
      console.log(chalk.green('模版创建成功，请进入对应目录执行 npm i 安装依赖'))

    } catch (error) {
      console.error(
        chalk.red(error.message)
      )
    }
  })
}
