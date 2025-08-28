import { createMemoryRouter } from 'react-router'
import RouterStore from '@/utils/RouterStore'
import { autorun } from 'mobx'

let dispose

afterEach(() => {
  dispose?.()
  dispose = undefined
})

const setupStore = () => {
  const routerStore = new RouterStore()
  const router = createMemoryRouter([{ path: '*' }], {
    initialEntries: ['/'],
  })
  routerStore.syncWithRouter(router)
  return routerStore
}

it('should provide observable location', async () => {
  const routerStore = setupStore()

  // observe location changes
  let pathname
  dispose = autorun(() => {
    pathname = routerStore.location.pathname
  })

  expect(pathname).toEqual('/')
  try {
    await routerStore.navigate(-1)
  } catch (e) {
    console.log(e)
  }
  routerStore.push('/dataset')
  expect(pathname).toEqual('/dataset')

  routerStore.replace('/dataset/1')
  expect(pathname).toEqual('/dataset/1')

  routerStore.goBack()
  expect(pathname).toEqual('/')

  routerStore.navigate(1)
  expect(pathname).toEqual('/dataset/1')
})
