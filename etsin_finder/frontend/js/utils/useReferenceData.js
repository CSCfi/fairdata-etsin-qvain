import { useEffect, useState } from 'react'
import { useStores } from './stores'
import { sortOptions } from '@/components/qvain/utils/select'
import { isAbort } from './AbortClient'

const useReferenceData = (type, { client, searchText, handler, sort = false } = {}) => {
  const {
    Qvain: { ReferenceData },
    Locale: { lang },
  } = useStores()
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let opts
      try {
        setIsLoading(true)
        opts = await ReferenceData.getOptions(type, { client, searchText })
        if (sort) {
          sortOptions(lang, opts)
        }
        if (handler) {
          opts = handler(opts) // preprocess options with handler
        }
        setOptions(opts)
      } catch (error) {
        if (isAbort(error)) {
          return
        }
        if (error.response) {
          // Error response from Metax
          console.error(error.response.data, error.response.status, error.response.headers)
        } else if (error.request) {
          // No response from Metax
          console.error(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, type, lang, sort])

  return { options, isLoading }
}

export default useReferenceData
