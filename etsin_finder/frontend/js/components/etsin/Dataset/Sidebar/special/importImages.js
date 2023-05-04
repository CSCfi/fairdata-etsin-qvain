function importAll(r) {
  const images = {}
  r.keys().map(item => {
    images[item.replace('./', '')] = r(item)
    return true
  })
  return images
}

const importImages = () => importAll(
  require.context('@/../static/images/catalog_logos', false, /\.(png|jpe?g|svg)$/)
)

export default importImages
