const queryParamEnabled = (location, param) => {
  if (!location?.search) {
    return false
  }
  const searchParams = new URLSearchParams(location.search)
  const value = searchParams.get(param)
  return value === '' || value === 'true' || value === '1'
}

export default queryParamEnabled
