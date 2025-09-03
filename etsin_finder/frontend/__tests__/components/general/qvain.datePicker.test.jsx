import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '@/styles/theme'
import DatePicker, { handleDatePickerChange } from '@/components/qvain/general/V2/Datepicker'
import LocaleStore from '@/stores/view/locale'

// Fake system time so calendar always shows same month.
// This also requires disabling delay in userEvent.
jest.useFakeTimers().setSystemTime(new Date('2026-02-11'))
const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

const getStores = () => ({
  Locale: LocaleStore,
})

window.requestAnimationFrame = callback => setTimeout(callback, 0)

describe('Qvain DatePicker', () => {
  const keys = []
  const onKeyDown = event => {
    keys.push(event.key)
  }
  let inputDate
  const setInputDate = date => {
    inputDate = date
  }

  const renderPicker = stores =>
    render(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <summary id="events" onKeyDown={onKeyDown}>
            <DatePicker onChange={date => handleDatePickerChange(date, setInputDate)} />
          </summary>
        </ThemeProvider>
      </Provider>
    )

  afterEach(() => {
    keys.length = 0
    inputDate = undefined
  })

  it('opens when focused', async () => {
    const stores = getStores()
    renderPicker(stores)
    expect(screen.queryByText('February 2026')).not.toBeInTheDocument()

    // Selector opens
    const picker = screen.getByRole('textbox')
    await user.click(picker)
    expect(screen.getByText('February 2026')).toBeInTheDocument()

    // Selector closes when defocused
    await user.click(document.body)
    expect(screen.queryByText('February 2026')).not.toBeInTheDocument()
  })

  it('closes on escape and stops the event', async () => {
    const stores = getStores()
    renderPicker(stores)

    // Selector opens
    const picker = screen.getByRole('textbox')
    await user.click(picker)
    expect(screen.getByText('February 2026')).toBeInTheDocument()

    await user.keyboard('{ArrowLeft}{ArrowUp}{Escape}')

    // Selector closes when escape is pressed,
    // other keypresses were passed through
    await user.click(document.body)
    expect(screen.queryByText('February 2026')).not.toBeInTheDocument()

    expect(keys).toEqual(['ArrowLeft', 'ArrowUp'])
  })

  it('supports manual input in d.m.y format', async () => {
    const stores = getStores()
    renderPicker(stores)

    const picker = screen.getByRole('textbox')
    await user.click(picker)
    await user.keyboard('1.2.2025')
    expect(inputDate).toEqual('2025-02-01')
  })

  it('supports manual input in m/d/y format', async () => {
    const stores = getStores()
    renderPicker(stores)

    const picker = screen.getByRole('textbox')
    await user.click(picker)
    await user.keyboard('2/10/2026')
    expect(inputDate).toEqual('2026-02-10')
  })

  it('supports manual input in y-m-d format', async () => {
    const stores = getStores()
    renderPicker(stores)

    const picker = screen.getByRole('textbox')
    await user.click(picker)
    await user.keyboard('2027-2-28')
    expect(inputDate).toEqual('2027-02-28')
  })

  it('supports manual input dates before year 1800', async () => {
    const stores = getStores()
    renderPicker(stores)

    const picker = screen.getByRole('textbox')
    await user.click(picker)
    await user.keyboard('01/01/1771')
    expect(inputDate).toEqual('1771-01-01')
  })
})
