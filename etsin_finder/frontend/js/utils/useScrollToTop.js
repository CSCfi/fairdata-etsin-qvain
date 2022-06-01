import { useRef, useEffect } from 'react'

const useScrollToTop = () => {
  // Scroll ref element to top on mount, useful for modal content
  const ref = useRef()
  useEffect(() => {
    window.setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTo({ top: 0, behavior: 'instant' })
      }
    })
  }, [])

  return ref
}

export default useScrollToTop
