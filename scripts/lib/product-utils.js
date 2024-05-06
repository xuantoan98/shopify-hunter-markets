const productsBySkus =
  (products) =>
    products.reduce((agg, product, index) => {
      product.skus.forEach(sku => {
        if (typeof agg[sku] === 'undefined') {
          agg[sku] = []
        }

        agg[sku].push(products[index])
      })

      return agg
    }, {})

const dedupe = (arr) => [...new Set(arr)]

module.exports = {
  productsBySkus,
  dedupe
}
