const Api = require('./lib/api.js')
const Walker = require('./lib/product-walker.js')
const fs = require('fs')
const path = require('path')
const FILE_NAME = 'all-products.json'

class DownloadProducts {
  constructor (env) {
    this.api = Api(env)
    this.products = []
    this.filePath = path.resolve(__dirname, 'data', FILE_NAME)
  }

  async main () {
    const walker = new Walker({ api: this.api, callback: this.store.bind(this) })
    await walker.run()
    const output = this.products
    this.writeFile(output)
  }

  writeFile (output) {
    fs.writeFileSync(this.filePath, JSON.stringify(output, null, 2))
  }

  store (product) {
    this.products.push(product)
  }
}

(new DownloadProducts(process.env.NODE_ENV)).main()
