
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
