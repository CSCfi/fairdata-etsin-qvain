/**
 * Takes an object of URL-building functions and returns a new object
 * with the same shape where a HTTPS host is prefixed to the generated URLs.
 *
 * @param urls - An object mapping keys to URL-building functions
 * @param host - The host to prepend (e.g. "metax.fairdata.fi")
 */
export const addHostToUrls = <T extends Record<string, (...args: any[]) => string>>(
  urls: T,
  host: string
): T => {
  const result = {} as T
  for (const key of Object.keys(urls) as Array<keyof T>) {
    result[key] = ((...args: any[]) => `https://${host}${urls[key](...args)}`) as T[typeof key]
  }
  return result
}
