const productionConfig = require('./webpack.production.config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

productionConfig.plugins.push(new BundleAnalyzerPlugin())

module.exports = productionConfig
