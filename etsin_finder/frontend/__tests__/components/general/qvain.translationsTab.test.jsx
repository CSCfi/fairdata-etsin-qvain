import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import TranslationTab from '../../../js/components/qvain/general/V2/TranslationTab'
import { buildStores } from '../../../js/stores'
import { useStores } from '../../../js/stores/stores'

jest.mock('../../../js/stores/stores')

describe('TranslationsTab', () => {
  let wrapper, tab
  let Stores

  describe('given default setup of Stores and language set to en', () => {
    const props = {
      language: 'en',
      setLanguage: jest.fn(),
      children: <div></div>,
      id: 'id',
    }

    beforeEach(() => {
      Stores = buildStores()
      useStores.mockReturnValue(Stores)
      wrapper = shallow(<TranslationTab {...props} />)
    })

    test('should exist', () => {
      wrapper.exists().should.be.true
    })

    describe('primary tab', () => {
      beforeEach(() => {
        tab = wrapper.find('#id-tab-en')
      })

      test('should exist', () => {
        tab.exists().should.be.true
      })

      test('should include expectedProps', () => {
        const expectedProps = {
          active: true,
          language: 'en',
        }

        tab.props().should.include(expectedProps)
      })

      describe('when triggering onClick', () => {
        beforeEach(() => {
          tab.simulate('click')
        })

        test("should call setLanguage with 'en'", () => {
          const expectedLang = 'en'
          expect(props.setLanguage).to.have.beenCalledWith(expectedLang)
        })
      })
    })

    describe('secondary tab', () => {
      beforeEach(() => {
        tab = wrapper.find('#id-tab-fi')
      })

      test('should exist', () => {
        tab.exists().should.be.true
      })

      test('should include expectedProps', () => {
        const expectedProps = {
          active: false,
          language: 'fi',
        }

        tab.props().should.include(expectedProps)
      })

      describe('when triggering onClick', () => {
        beforeEach(() => {
          tab.simulate('click')
        })

        test("should call setLanguage with 'fi'", () => {
          const expectedLang = 'fi'
          expect(props.setLanguage).to.have.beenCalledWith(expectedLang)
        })
      })
    })
  })
})
