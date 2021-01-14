import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'

import '../../../locale/translations'
import etsinTheme from '../../../js/styles/theme'
import DatePicker, {
  StyledCustomDatePicker,
} from '../../../js/components/qvain/general/input/datepicker'
import LocaleStore from '../../../js/stores/view/locale'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

const getStores = () => {
  return {
    Locale: LocaleStore,
  }
}

// Mock missing functions
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})

window.requestAnimationFrame = callback => setTimeout(callback, 0)

describe('Qvain DatePicker', () => {
  const keys = []
  const onKeyDown = event => {
    // console.log('here', event.key)
    keys.push(event.key)
  }

  let wrapper
  const render = stores => {
    return mount(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <div id="events" onKeyDown={onKeyDown}>
            <DatePicker />
          </div>
        </ThemeProvider>
      </Provider>
    )
  }

  afterEach(() => {
    if (wrapper && wrapper.unmount && wrapper.length === 1) {
      wrapper.unmount()
      wrapper = null
    }
    keys.length = 0
  })

  it('opens when focused', async () => {
    const stores = getStores()
    wrapper = render(stores)

    let picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(false)

    wrapper.find('input').simulate('focus')
    await Promise.resolve()
    picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(true)

    wrapper.find('input').simulate('blur')
    await Promise.resolve()
    picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(false)
  })

  it('closes on escape and stops the event', async () => {
    const stores = getStores()
    wrapper = render(stores)
    const input = wrapper.find('input')

    input.simulate('focus')
    await Promise.resolve()
    let picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(true)

    // calendar open, stop escape event
    input.simulate('keydown', { key: 'ArrowLeft' })
    input.simulate('keydown', { key: 'ArrowUp' })
    input.simulate('keydown', { key: 'Escape' })
    await Promise.resolve()

    // calendar closed, other keypresses were passed through
    picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(false)
    expect(keys).toEqual(['ArrowLeft', 'ArrowUp'])
  })

  it('passes key events', async () => {
    const stores = getStores()
    wrapper = render(stores)
    const input = wrapper.find('input')

    input.simulate('focus')
    await Promise.resolve()
    let picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(true)

    // close with escape
    input.simulate('keydown', { key: 'Escape' })
    await Promise.resolve()
    picker = wrapper.find(StyledCustomDatePicker)
    expect(picker.prop('open')).toBe(false)
    expect(keys).toEqual([])

    // calendar closed, pass all keypresses
    input.simulate('keydown', { key: 'Escape' })
    input.simulate('keydown', { key: 'ArrowLeft' })
    await Promise.resolve()

    picker = wrapper.find(StyledCustomDatePicker)
    expect(keys).toEqual(['Escape', 'ArrowLeft'])
  })
})
