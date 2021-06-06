const { join } = require('path')
const compressing = require('compressing')
const fs = require('fs')
const axios = require('axios')
const handlebars = require('handlebars')

const dirname = process.cwd()

function changePath () {
  let isRoot = false
  try {
    const packageJson = require(join(dirname, 'package.json'))
    if (!!packageJson.dependencies['xxplugin']) {
      isRoot = true
    }
  } catch (error) {
    // console.log(error)
  }

  if (isRoot) return join(dirname, 'projects')
  return dirname
}

const initPackageJson = (name, child) => new Promise((resolve, reject) => {
  let basePath = dirname
  if (child) {
    basePath = changePath()
  }
  const target = join(basePath, name, 'package.json')
  if (fs.existsSync(target)) {
    const a = fs.readFileSync(target).toString()
    const b = handlebars.compile(a)({ name })
    fs.writeFileSync(target, b)
    resolve()
  } else {
    reject(new Error('写入项目文件发生错误!'))
  }
})

async function downLoad (template, name, child) {
  let basePath = dirname
  if (child) {
    basePath = changePath()
  }

  const writer = fs.createWriteStream(join(basePath, `${name}.zip`))

  const res = await axios.get(global.baseURL + 'download-template', {
    params: { template }, responseType: 'stream',
  })

  res.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('error', reject)
    writer.on('finish', () => resolve(name))
  })
}

function unzip (name, child) {
  let basePath = dirname, targetName = name
  if (child) {
    basePath = changePath()
    if (basePath !== dirname) {
      targetName = join('projects', name)
    }
  }
  return new Promise((resolve, reject) => {
    compressing.zip.uncompress(join(basePath, `${name}.zip`), targetName).then(() => resolve()).catch(err => reject(err))
  })
}

function delZipFile (name, child) {
  let basePath = dirname
  if (child) {
    basePath = changePath()
  }
  fs.unlinkSync(
    join(basePath, `${name}.zip`)
  )
}

module.exports = {
  initPackageJson,
  downLoad,
  unzip,
  delZipFile,
}
