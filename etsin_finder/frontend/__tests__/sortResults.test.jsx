import React from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line no-unused-vars
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'

import SortResults from '../js/components/search/sortResults'

describe('SortResults', () => {
  describe('SortResults from url', () => {
    const filterItem = mount(
      <MemoryRouter>
        <SortResults />
      </MemoryRouter>
    )
    it('should contain value best', () => {
      expect(
        filterItem
          .find('.select-button')
          .children()
          .prop('value')
      ).toEqual('best')
    })
  })
})
