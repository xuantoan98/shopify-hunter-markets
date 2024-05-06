const loader = require('loader-utils')
const validateOptions = require('schema-utils')

const loaderSchema = {
  type: 'object',
  properties: {
  }
}

module.exports = function (source) {
  const options = loader.getOptions(this) || {}

  validateOptions(loaderSchema, options, 'Shopify Settings Loader')

  if (!options.from) {
    options.from = 'postcss'
  }

  // replace shopify liquid code
  let src = source.replace(/\$\(\s*(settings[^)]+|[^)]+\|[^)]+)\s*\)/g, '{{ $1 }}')

  // replace any other placeholder tags
  return src.replace(/\$\(([^)]+)\)/g, '$1')
}
