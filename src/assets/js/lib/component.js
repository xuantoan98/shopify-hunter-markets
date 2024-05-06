class Component {
  // class detection while avoiding uglify mangling
  static getClassName () {
    return 'Component'
  }

  constructor (name, namespace) {
    this.name = name
    this.namespace = namespace
  }

  register () {
    return {}
  }

  store () {
    return null
  }

  setInstance (instance) {
    this.instance = instance
  }
}

export default Component
