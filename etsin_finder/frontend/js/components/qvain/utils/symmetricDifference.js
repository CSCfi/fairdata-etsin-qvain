export default (a, b) => {
  // Return symmetric set difference between two iterables
  const setA = new Set(a)
  const setB = new Set(b)
  const diffA = Array.from(setA).filter(x => !setB.has(x))
  const diffB = Array.from(setB).filter(x => !setA.has(x))
  return [...diffA, ...diffB] // will be an empty list for equal sets
}
