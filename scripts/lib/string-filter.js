const cleanUpSpecialChars = (string) => {
  string = string.replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[ñ]/g, 'n')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
  return string
}

const handleize = (string) => {
  if (string) {
    string = cleanUpSpecialChars(string.toLowerCase().trim())

    const toReplace = ['"', "'", '\\', '(', ')', '[', ']']

    for (let i of toReplace) {
      string = string.replace(i, '')
    }

    string = string.replace(/\W+/g, '-')

    if (string.charAt(string.length - 1) === '-') {
      string = string.replace(/-+\z/, '')
    }

    if (string.charAt(0) === '-') {
      string = string.replace(/\A-+/, '')
    }
  }
  return string
}

const simpleDecode = (str) => {
  const map = {amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'"}
  return str = str.replace(/&([^;]+);/g, (m, c) => map[c])
}

const titleCase = (str) => {
  if (str) {
    return str.toLowerCase().split(' ').map(function (word) {
      return word.replace(word[0], word[0].toUpperCase())
    }).join(' ')
  }

  return str
}

const lowerCase = (string) => {
  if (string) {
    return string.toString().toLowerCase()
  }
}

module.exports = {
  cleanUpSpecialChars,
  handleize,
  simpleDecode,
  titleCase,
  lowerCase
}
