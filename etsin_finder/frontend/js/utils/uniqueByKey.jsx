const uniqueByKey = (array, key) => {
  const values = new Set()
  return array.filter(item => {
    if (values.has(item[key])) {
      return false
    }
    values.add(item[key])
    return true
  })
}

export default uniqueByKey
