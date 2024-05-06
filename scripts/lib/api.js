/* global process */
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const Shopify = require('shopify-api-node')

const PATH = path.resolve(path.join(__dirname, '/../../config.yml'))

const Api = (env = 'development') => {
  let config = null
  try {
    config = yaml.safeLoad(fs.readFileSync(PATH))
  } catch (e) {
    process.exit(1)
  }

  const app = config[env]

  if (app) {
    return Shopify({
      shopName: app.store,
      apiKey: app.api_key,
      password: app.password,
      autoLimit: {
        calls: 2,
        interval: 1000,
        bucketSize: 3
      }
    })
  }

  return null
}

module.exports = Api
