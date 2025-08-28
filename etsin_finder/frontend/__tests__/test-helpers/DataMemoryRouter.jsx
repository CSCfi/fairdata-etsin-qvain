import { useRef } from 'react'
import PropTypes from 'prop-types'
import { createMemoryRouter, RouterProvider } from 'react-router'

/* Replacement for MemoryRouter in tests
 * that need a data router. Needed for useBlocker (and usePrompt) to work.
 * Includes an optional stores prop for tests that need stores.Env.history.
 */
const DataMemoryRouter = ({ initialEntries = ['/'], initialIndex = 0, children, stores }) => {
  const router = useRef(
    createMemoryRouter(
      [
        {
          path: '*', // match everything with "*"
          element: children,
        },
      ],
      { initialEntries, initialIndex }
    )
  )
  if (stores?.Env) {
    stores.Env.history.syncWithRouter(router.current)
  }
  return <RouterProvider router={router.current} />
}

DataMemoryRouter.propTypes = {
  children: PropTypes.node,
  initialEntries: PropTypes.array,
  initialIndex: PropTypes.number,
  stores: PropTypes.object,
}

export default DataMemoryRouter
