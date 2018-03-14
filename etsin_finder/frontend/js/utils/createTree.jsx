const makeSmall = tree => {
  const newTree = []

  const findPath = (array, index) => {
    if (array[index].path) {
      return newTree.push(array[index])
    }
    const children = array[index].children
    return children.map((child, i) => {
      if (child.path) {
        return newTree.push(child)
      }
      return findPath(children, i)
    })
  }

  tree.map((item, index) => findPath(tree, index))

  return newTree
}

const createTree = files => {
  if (!files) {
    return false
  }
  const hierarchy = files.reduce((hier, file) => {
    let x = hier
    const split = file.path.split('/')
    split.map((item, index) => {
      let current = x.find(single => single.name === item)
      if (!current) {
        if (index === split.length - 1) {
          current = { name: item }
          x.push(current)
        } else {
          current = { name: item, children: [], childAmount: 0 }
          x.push(current)
        }
      } else {
        const amountindex = x.indexOf(current)
        x[amountindex].childAmount += 1
      }
      const i = x.map(single => single.name).indexOf(item)
      if (index === split.length - 1) {
        Object.assign(x[i], file)
      }
      x = x[i].children
      return true
    })
    return hier
  }, [])
  return makeSmall(hierarchy)
}

export default createTree
