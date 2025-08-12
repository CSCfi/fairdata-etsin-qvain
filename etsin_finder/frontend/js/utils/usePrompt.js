import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

/* Hook for blocking navigation when there are unsaved changes.
 *
 * When shouldBlock is true, prompt before navigation.
 * Navigating within the site shows the provided message in the prompt.
 * Navigating using the address bar or reloading the page shows a
 * browser-specific prompt message that cannot be changed.
 *
 * Implementation based on unsafe_usePrompt from react-router-dom
 */
export function usePrompt({ shouldBlock, message }) {
  const blocker = useBlocker(shouldBlock)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      let proceed = window.confirm(message)
      if (proceed) {
        setTimeout(blocker.proceed, 0) // Avoid navigation race issues
      } else {
        blocker.reset()
      }
    }
  }, [blocker, message])

  useEffect(() => {
    if (blocker.state === 'blocked' && !shouldBlock) {
      blocker.reset()
    }
  }, [blocker, shouldBlock])

  return blocker
}
