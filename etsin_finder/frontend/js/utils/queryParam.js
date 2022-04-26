const queryParam = (location, param) => {
  if (!location?.search) {
    return ''
  }
  const searchParams = new URLSearchParams(location.search)
  const value = searchParams.get(param)
  return value
}

export default queryParam
