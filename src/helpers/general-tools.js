module.exports.encode = (value, type = 'utf8', hashTo = 'base64') => {
  return Buffer.from(value, type).toString(hashTo)
}

module.exports.decode = (value, type = 'base64', hashTo = 'utf8') => {
  return Buffer.from(value, type).toString(hashTo)
}

module.exports.compare = (value1, value2) => {
  return Buffer.compare(value1, value2)
}
