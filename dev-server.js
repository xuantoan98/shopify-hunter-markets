const fs = require('fs')
const path = require('path')
const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')
const yaml = require('js-yaml')

const ENVIRONMENT = 'development'

let proxyTarget = null
let config = null

try {
  config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'config.yml')))
  proxyTarget = 'https://' + (config[ENVIRONMENT].domain || config[ENVIRONMENT].store)
} catch (e) {
  console.error(e)
}

let bundler = webpack(webpackConfig)

browserSync.init({
  startPath: config ? '?preview_theme_id=' + config[ENVIRONMENT]['theme_id'].toString() : null,

  snippetOptions: {
    rule: {
      match: /<head[^>]*>/i,
      fn: function (snippet, match) {
        return match + snippet
      }
    }
  },

  files: [
    {
      // js changes are managed by webpack
      match: [
        path.join(__dirname, '.themekit')
      ],
      // manually reload when themekit uploaded file into Shopify server
      fn: synchronize
    }
  ],

  proxy: {
    // proxy local WP install
    target: proxyTarget,

    proxyReq: [
      (proxyReq) => {
        proxyReq.setHeader('X-DEV', '1')
      }
    ],

    middleware: [

      // converts browsersync into a webpack-dev-server
      webpackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true
      }),

      // hot update js and css
      webpackHotMiddleware(bundler)

    ]
  },

  notify: false
})

function synchronize (event, file) {
  // Reload browser on theme updated
  setTimeout(() => browserSync.reload(), 500)
}
