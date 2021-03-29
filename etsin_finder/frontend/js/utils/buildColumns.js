// create named grid-template-columns from [name, value] pairs
const buildColumns = columns => {
  if (columns.length === 0) {
    return ''
  }
  const parts = []
  let startName = columns[0][0]
  let endName = ''
  for (const [name, value] of columns) {
    startName = name
    if (endName) {
      parts.push(`[${endName}-end ${startName}-start]`)
    } else {
      parts.push(`[${startName}-start]`)
    }
    parts.push(value)
    endName = startName
  }
  parts.push(`[${columns[columns.length - 1][0]}-end]`)
  return parts.join(' ')
}

export default buildColumns
