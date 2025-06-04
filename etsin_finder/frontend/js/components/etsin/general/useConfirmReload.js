import { autorun } from 'mobx'
import { useEffect } from 'react'

// Event handler to prevent page reload
const confirmReload = e => {
  e.preventDefault()
  e.returnValue = ''
}

/**
 * @description Callback with an observable reaction that returns boolean
 * @callback shouldConfirmCallback
 * @returns {boolean}
 */

/**
 * @description Require confirmation for page reload when callback returns true.
 * @param {shouldConfirmCallback} callback Should reload require confirmation?
 */
const useConfirmReload = callback => {
  useEffect(() => {
    return autorun(() => {
      if (callback()) {
        window.addEventListener('beforeunload', confirmReload)
      } else {
        window.removeEventListener('beforeunload', confirmReload)
      }
    })
  }, [callback])
}

export default useConfirmReload
