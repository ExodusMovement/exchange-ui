#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const watchman = require('fb-watchman')

const args = process.argv.slice(2)
const client = new watchman.Client()

if (!args[0]) throw new Error('Watch target directory missing')

const id = 'ftx'
const project = path.resolve('./')
const sourceDir = path.resolve(args[0] + '/node_modules/@exodus/exchange-ui')

const sub = {
  expression: ['anyof', ['match', '*.js'], ['match', '*.json']],
  fields: ['name', 'exists', 'type'],
}

if (!fs.existsSync(sourceDir)) fs.mkdirSync(sourceDir)

client.capabilityCheck({ optional: [], required: ['relative_root'] }, (error, resp) => {
  if (error) {
    console.log(error)
    return client.end()
  }

  // Initiate the watch
  client.command(['watch-project', project], (error, resp) => {
    if (error) return console.error('Error initiating watch:', error)

    console.log(chalk.blue('Watching ', resp.watch, 'into', sourceDir))

    client.command(['subscribe', resp.watch, id, sub])

    client.on('subscription', function (resp) {
      if (resp.subscription !== id) return

      resp.files.forEach(function (file) {
        const source = path.resolve(project, file.name)
        const target = path.resolve(sourceDir, file.name)

        if (file.type !== 'f') return

        if (file.exists) {
          fs.ensureFileSync(target)
          fs.copyFileSync(source, target)
        } else {
          fs.removeSync(target)
        }
      })

      console.log(chalk.yellow('Files updated!'), chalk.gray(`(${resp.files.length})`))
    })
  })
})
