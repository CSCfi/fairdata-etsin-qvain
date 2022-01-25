const joinParts = parts => {
  const nonEmptyParts = parts.filter(p => p)
  let joined = nonEmptyParts.splice(0, 1)
  if (nonEmptyParts.length > 0) {
    joined += ` (${nonEmptyParts.join(', ')})`
  }
  return joined
}

const getPersonLabel = ({ name, uid, email }) => joinParts([name, uid, email])

export default getPersonLabel
