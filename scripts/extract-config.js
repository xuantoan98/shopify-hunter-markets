#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const schema = require('../src/config/settings_schema.json')

const DEST = path.resolve(__dirname, '../src/config/lib/')

schema.forEach(
  function (config, idx) {
    const fileName = idx + '-' + config.name.toLowerCase().replace(/[^0-9a-z\-]/g, '-')

    fs.writeFile(`${DEST}/${fileName}.json`, JSON.stringify(config, null, 2), function(err) {
      if (err) {
        return console.error(err)
      }

      console.log(`Saved config/lib/${fileName}.json`)
    })
  }
)

