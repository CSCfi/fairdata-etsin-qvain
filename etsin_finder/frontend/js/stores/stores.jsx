import React from 'react'
import PropTypes from 'prop-types'

export const StoresContext = React.createContext()

export const StoresProvider = ({ store, children }) => (
  <StoresContext.Provider value={store}>{children}</StoresContext.Provider>
)

StoresProvider.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

export const useStores = () => React.useContext(StoresContext)

export const withStores = Component => props => <Component {...props} store={useStores()} />
