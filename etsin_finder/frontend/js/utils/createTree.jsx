{
/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */
}

// Removes common parents from tree
// ---
// folder/folder2/file
// folder/folder2/file2
// folder/folder2
// folder3
// =>
// folder2
// folder3
const removeCommonParents = tree => {
  const newTree = []

  const findPath = (array, index) => {
    if (array[index].path) {
      return newTree.push(array[index])
    }
    if (!array[index].children) {
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

// creates a hierarchial folder tree from files and folders
// input: array of files and folders with paths
// output: files and folders placed inside parent folders as children
// [
//   { // root lvl file
//     name: string
//   },
//   { // root lvl folder
//     childAmount: number
//     children: array
//     name: string
//   }
// ]

export default function createTree(files) {
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
  return removeCommonParents(hierarchy)
}
