
// flatten the hierarchy and get all the files in all the selected directories
export const getFiles = (dir) => [].concat(dir.files || []).concat(
  ...(dir.directories ? dir.directories.map(d => getFiles(d)) : [])
)

export const getAllFiles = (dirs) => dirs.map(d => getFiles(d)).flat()

// same, but for directories. Goes through an entire directory hierarchy tree and makes an one-dimensional
// of directories found within the directory tree.
export const getDirectories = (dir) => [].concat(dir.directories || []).concat(
  ...(dir.directories ? dir.directories.map(d => getDirectories(d)) : [])
)

// used to deep copy selected directories to the selectedDirectories array in qvain
// state store. We need all of the internal data structures to be copied as well,
// which is why shallow copying is not enough.
export const deepCopy = (oldObj) => {
  let newObj = oldObj
  if (oldObj && typeof oldObj === 'object') {
    newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {}
    Object.keys(oldObj).forEach(key => {
      newObj[key] = deepCopy(oldObj[key])
    })
  }
  return newObj
}
