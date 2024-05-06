module.exports = function (api) {
  api.cache(true)

  return {
    ignore: [/node_modules\/(?!(body-scroll-lock)\/)/],
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-transform-object-assign',
      [
        '@babel/plugin-transform-regenerator',
        {
          corejs: 3
        }
      ]
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
          modules: false
        }
      ]
    ]
  }
}
