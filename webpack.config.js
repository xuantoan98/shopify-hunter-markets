const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const HOST = 'localhost'
const PORT = 3000

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: ['whatwg-fetch', './src/assets/css/main.css', './src/assets/js/main', `webpack-hot-middleware/client?https://${HOST}:${PORT}&reload=true`]
    // enable the line below for checkout
    // checkout: ['@babel/polyfill', './src/assets/css/checkout.css', './src/assets/js/checkout', `webpack-hot-middleware/client?https://${HOST}:${PORT}&reload=true`]
  },
  output: {
    path: path.join(__dirname, 'dist/assets'),
    filename: '[name].js',
    chunkFilename: '[name]-[id].js',
    publicPath: `//${HOST}:${PORT}/dev`
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        use: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader' },
          { loader: './tasks/loaders/shopify-settings.js' },
          { loader: 'postcss-loader' }
        ]
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
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
