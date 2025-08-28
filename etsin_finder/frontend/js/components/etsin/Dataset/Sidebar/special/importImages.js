const importImages = () => {
  const images = import.meta.glob('@/assets/images/catalog_logos/*', {
    query: '?url',
    import: 'default',
    eager: true,
  })
  // Extract image filenames from the full path
  return Object.fromEntries(
    Object.entries(images).map(([path, image]) => [path.split('/').pop(), image])
  )
}

export default importImages
