const Api = require('./lib/api.js')
const Walker = require('./lib/product-walker.js')

const updateTags = (price) => {
  let priceTag = ''
  if (price >= 5 && price <= 24) {
    priceTag = 'price-$5 - $24'
  } else if (price >= 25 && price <= 49) {
    priceTag = 'price-$25 - $49'
  } else if (price >= 50 && price <= 99) {
    priceTag = 'price-$50 - $99'
  } else {
    priceTag = 'price-$100 +'
  }
  return priceTag
}

class UpdateTag {
  constructor (env) {
    this.api = Api(env)
  }

  main () {
    const walker = new Walker({ api: this.api, callback: this.updateTag.bind(this) })
    walker.run()
  }

  err (e) {
    console.error(e)
  }

  removeOldPriceTag (tags) {
    return tags.split(',')
      .filter((tag) => !tag.trim().match(/^price-/g))
      .map((tag) => tag.trim())
  }

  updateTag (product) {
    const currentProductTags = product.tags
    const priceTag = updateTags(product.variants[0].price)
    const newProductTags = this.removeOldPriceTag(currentProductTags)
    newProductTags.push(priceTag)
    newProductTags.join(',')
    /*
    Update product tag
     */
    this.api.product.update(
      product.id,
      {
        tags: newProductTags
      }
    )
      .then(() => console.log(`Updated tags for ${product.handle}. Price: ${product.variants[0].price}`))
      .catch(this.err)
  }
}

(new UpdateTag(process.env.NODE_ENV)).main()
