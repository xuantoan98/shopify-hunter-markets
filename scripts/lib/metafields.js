class Metafields {
  constructor ({api, namespace, key}) {
    this.api = api
    this.namespace = namespace
    this.key = key
  }

  processMetafields (metafields) {
    return metafields.filter((metafield) => metafield.namespace === this.namespace && metafield.key === this.key)
  }

  getMetafieldValue (productId) {
    return this.api.metafield.list({
      metafield: { owner_resource: 'product', owner_id: productId }
    }).then(
      metafields => {
        if (this.processMetafields(metafields).length) {
          return {
            value: this.processMetafields(metafields)[0].value,
            id: this.processMetafields(metafields)[0].id
          }
        }
      },
      err => console.error(err)
    )
  }

  createMetafield (productId, value, description = '') {
    this.api.metafield.create({
      key: this.key,
      value: value,
      value_type: 'string',
      namespace: this.namespace,
      owner_resource: 'product',
      owner_id: productId,
      description: description
    }).then(
      metafield => console.log(`Metafield updated for product ${productId} with value ${metafield.value}`),
      err => console.error(err)
    )
  }

  updateMetafield (metafieldId, value, description = '') {
    this.api.metafield.update(metafieldId, {
      value: value,
      description: description
    }).then(
      metafield => console.log(`Metafield updated for metafield ${metafieldId} with value ${metafield.value}`),
      err => console.error(err)
    )
  }

  deleteMetafield (metafieldId) {
    this.api.metafield.delete(metafieldId).then(
      metafield => console.log(`\`Deleted ${metafieldId} `),
      err => console.error(err)
    )
  }
}
module.exports = Metafields
