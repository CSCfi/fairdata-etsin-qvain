import { useRef, useEffect } from 'react'

const useScrollToTop = (enabled = true) => {
  // Scroll ref element to top on mount, useful for modal content
  const ref = useRef()
  useEffect(() => {
    if (enabled) {
      window.setTimeout(() => {
        if (ref.current?.scrollTo) {
          ref.current.scrollTo({ top: 0, behavior: 'instant' })
        }
      })
    }
  }, [enabled])

  return ref
}

export default useScrollToTop
