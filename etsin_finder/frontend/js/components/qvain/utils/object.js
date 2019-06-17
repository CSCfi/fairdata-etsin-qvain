
// gets deep nested values within objects.
// Param: array that acts as an "address" for the value, ex: ['path', 'to', 'object']
export const get = (p, o) => p.reduce((xs, x) => ((xs && xs[x]) ? xs[x] : undefined), o)

// returns deep nested value by dotted address
// ex. getPath('path.to.value', object)
export const getPath = (path, object) => {
  const pathArr = path.split('.')
  return get(pathArr, object)
}

export default getPath
