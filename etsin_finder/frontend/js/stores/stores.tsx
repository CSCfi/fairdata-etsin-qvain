import { createContext, useContext } from 'react'
import type { Stores } from '.'

export const StoresContext = createContext<Stores | undefined>(undefined)

export const StoresProvider = ({ store, children = null }: { store: Stores; children?: any }) => (
  <StoresContext.Provider value={store}>{children}</StoresContext.Provider>
)

/**
 * Return stores from StoresProvider context.
 */
export const useStores = (): Stores => {
  const stores = useContext(StoresContext)
  if (stores === undefined) {
    throw new Error('Stores missing from context, use StoresProvider.')
  }
  return stores
}
