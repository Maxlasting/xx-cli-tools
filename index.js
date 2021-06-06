#!/usr/bin/env node
const commander = require('commander')
const glob = require('glob')
const { join } = require('path')

const curtPackageJson = require('./package.json')

// global.baseURL = 'http://localhost:8677'
global.baseURL = 'https://www.dabuguowoba.com/cli/'

commander.version(curtPackageJson.version, '-v, --version')

glob.sync(join(__dirname, 'commands', '**/*.js')).forEach(_ => {
  require(_)(commander)
})

commander.parse(process.argv)
