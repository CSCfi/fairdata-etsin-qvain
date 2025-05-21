import { Provider } from 'mobx-react'
import { ThemeProvider } from 'styled-components'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import etsinTheme from '../../../js/styles/theme'
import DatePicker from '../../../js/components/qvain/general/V2/Datepicker'
import LocaleStore from '../../../js/stores/view/locale'

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

  const renderPicker = stores =>
    render(
      <Provider Stores={stores}>
        <ThemeProvider theme={etsinTheme}>
          <summary id="events" onKeyDown={onKeyDown}>
            <DatePicker />
          </summary>
        </ThemeProvider>
      </Provider>
    )

  afterEach(() => {
    keys.length = 0
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
})
