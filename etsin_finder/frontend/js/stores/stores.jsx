import { createContext, useContext, forwardRef } from 'react'
import PropTypes from 'prop-types'

export const StoresContext = createContext()

export const StoresProvider = ({ store, children = null }) => (
  <StoresContext.Provider value={store}>{children}</StoresContext.Provider>
)

StoresProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node,
}

StoresProvider.defaultProps = {
  children: null,
}

/**
 * Return stores from StoresProvider context.
 * @returns {ReturnType<import("./index.js").buildStores>}
 */
export const useStores = () => useContext(StoresContext)

export const withStores = Component =>
  // eslint-disable-next-line react/display-name
  forwardRef((props, ref) => <Component ref={ref} {...props} Stores={useStores()} />)
