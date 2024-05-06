const Api = require('./lib/api.js')
const Walker = require('./lib/product-walker.js')

const word = 'category-new-chocolates'
const newTags = (str) => str.replace(word, 'category-chocolate-collections-new-chocolates')
const checkTags = (str) => str.includes(word)

class UpdateTag {
  constructor (env) {
    this.api = Api(env)
  }

  main () {
    const walker = new Walker({ api: this.api, callback: this.tag.bind(this) })
    walker.run()
  }

  err (e) {
    console.error(e)
  }

  tag (product) {
    if (checkTags(product.tags)) {
      this.api.product.update(
        product.id,
        {
          tags: newTags(product.tags)
        }
      )
        .then(() => console.log('Updated tags for ' + product.handle))
        .catch(this.err)
    }
  }
}

(new UpdateTag(process.env.NODE_ENV)).main()
