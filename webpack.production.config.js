const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'production',
  entry: {
    scripts: ['whatwg-fetch', './src/assets/js/main'],
    // enable the line below for checkout
    // 'checkout-custom': ['./src/assets/js/checkout', './src/assets/css/checkout.css'],
    styles: './src/assets/css/main.css'
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: '[name].js',
    chunkFilename: `[name]-[id].js?version=${Date.now()}`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: './tasks/loaders/shopify-settings.js' },
            { loader: 'css-loader' },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  resolve: {
    alias: {
      'lib': path.resolve(__dirname, 'src/assets/js/lib'),
      'modules': path.resolve(__dirname, 'src/modules'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000}),
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}
