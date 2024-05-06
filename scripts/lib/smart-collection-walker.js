const PER_PAGE = 250

class SmartCollectionWalker {
  constructor ({ api, callback }) {
    this.api = api
  }

  processCollectionList (collections) {
    return collections
  }

  getCollections (page) {
    return this.api.smartCollection.list({
      limit: PER_PAGE,
      page: page
    }).then(
      this.processCollectionList.bind(this),
      this.err
    )
  }

  async paginateCollections () {
    const count = await this.api.smartCollection.count()
    const pages = Math.ceil(count / PER_PAGE)

    const promises = []
    for (let i = 1; i <= pages; i++) {
      promises.push(this.getCollections(i))
    }

    return Promise.all(promises)
  }

  async run () {
    const collections = await this.paginateCollections()
    return [].concat(...collections)
  }
}

module.exports = SmartCollectionWalker
