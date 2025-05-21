import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import { render, screen } from '@testing-library/react'

const store = observable({ value: 1 })

const Compo = observer(() => {
  return <div>{store.value}</div>
})

it('tests mobx', async () => {
  render(<Compo />)
  expect(screen.getByText('1'))
  runInAction(() => {
    store.value = 2
  })
  expect(await screen.findByText('2'))
})
