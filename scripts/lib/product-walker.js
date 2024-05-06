const PER_PAGE = 250

class ProductWalker {
  constructor ({api, callback}) {
    this.api = api
    this.callback = callback
  }

  processProductList (products) {
    products.map(this.callback)
  }

  getProducts (page) {
    return this.api.product.list({
      limit: PER_PAGE,
      page: page
    }).then(
      this.processProductList.bind(this),
      this.err
    )
  }

  async paginateProducts () {
    const count = await this.api.product.count()
    const pages = Math.ceil(count / PER_PAGE)

    const promises = []
    for (let i = 1; i <= pages; i++) {
      promises.push(this.getProducts(i))
    }

    return Promise.all(promises)
  }

  run() {
    return this.paginateProducts()
  }
}

module.exports = ProductWalker
