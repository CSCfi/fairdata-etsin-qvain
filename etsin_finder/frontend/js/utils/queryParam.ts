import type { Location } from 'react-router'

const queryParam = (location: Location, param: string): string | null => {
  if (!location?.search) {
    return ''
  }
  const searchParams = new URLSearchParams(location.search)
  const value = searchParams.get(param)
  return value
}

export default queryParam
