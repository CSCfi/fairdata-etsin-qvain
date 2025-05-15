import { screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

import DurationPicker from '@/components/qvain/general/V2/Durationpicker'
import contextRenderer from '../../test-helpers/contextRenderer'

const Field = {
  inEdit: {
    startDate: '1.1.2000',
    endDate: '2.2.2020',
  },
  translationsRoot: 'translationsRoot',
  changeAttribute: jest.fn(),
}

const datum = 'datum'
const id = 'id'

const expectedLabelContent = 'translationsRoot.datum.label'

describe('DurationPicker', () => {
  const props = { Field, datum, id }
  const stores = {
    Qvain: {
      readonly: false,
    },
    Locale: {
      lang: 'en',
      translate: v => v,
    },
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderPicker = () => contextRenderer(<DurationPicker {...props} />, { stores })

  test('label should be parsed from given props', () => {
    renderPicker()
    expect(screen.getByText(expectedLabelContent)).toBeInTheDocument()
  })

  test('should render starting date', async () => {
    renderPicker()
    await userEvent.click(screen.getByLabelText('translationsRoot.datum.startInfoText'))
    await userEvent.click(screen.getByLabelText('Choose Sunday, December 26th, 1999'))
    expect(Field.changeAttribute.mock.calls[0]).toEqual(['startDate', '1999-12-26'])
  })

  test('should render ending date', async () => {
    renderPicker()
    await userEvent.click(screen.getByLabelText('translationsRoot.datum.endInfoText'))
    await userEvent.click(screen.getByLabelText('Choose Sunday, January 26th, 2020'))
    expect(Field.changeAttribute.mock.calls[0]).toEqual(['endDate', '2020-01-26'])
  })
})
