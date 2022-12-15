import createMemoryHistory from 'history/createMemoryHistory'
import RouterStore from '@/utils/RouterStore'
import { autorun } from 'mobx'

let dispose

afterEach(() => {
  dispose?.()
  dispose = undefined
})

const setupStore = () => {
  const routerStore = new RouterStore()
  const history = createMemoryHistory({ initialEntries: ['/'] })
  routerStore.syncWithHistory(history)
  return routerStore
}

it('should provide observable location', () => {
  const routerStore = setupStore()

  // observe location changes
  let pathname
  dispose = autorun(() => {
    pathname = routerStore.location.pathname
  })

  expect(pathname).toEqual('/')
  routerStore.push('/dataset')
  expect(pathname).toEqual('/dataset')
})
