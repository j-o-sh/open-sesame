function toCamelCase (string) {
  return string.replaceAll(/\-(\w)/g, (_ ,l) => l.toUpperCase())
}

export function queryParams (handler, { 
  asArrays = [],
  camelCase = true
} = {}) {
  return ({request}) => {
    const query = new URLSearchParams(request.url.split('?').at(1))
    const qObj = {}
    for (const key of query.keys()) {
      const qKey = camelCase ? toCamelCase(key) : key
      qObj[qKey] = asArrays.includes(key) ? query.getAll(key) : query.get(key)
    }
    return handler(qObj)
  }
}
