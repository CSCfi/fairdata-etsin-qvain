import React from 'react'
import { mount } from 'enzyme'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { registerHelpers } from '../../../test-helpers'

//test data
import { applyMockAdapter } from '../../../__testdata__/referenceData.data'
import datasetIda from '../../../__testdata__/dataset.ida'

import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { StoresProvider } from '@/stores/stores'
import { buildStores } from '@/stores'
import etsinTheme from '@/styles/theme'
import '@/../locale/translations.js'

import Editor from '@/components/qvain/views/DatasetEditorV2'
import FilePicker from '@/components/qvain/sections/DataOrigin/general/FilePicker'
import CumulativeDataset from '@/components/qvain/sections/DataOrigin/IdaCatalog/CumulativeDataset'

// sections
import DataOrigin from '@/components/qvain/sections/DataOrigin'
import PasCatalog from '@/components/qvain/sections/DataOrigin/PasCatalog'

registerHelpers()

const mockAdapter = new MockAdapter(axios)
applyMockAdapter(mockAdapter)

// testing editor as a whole

describe('EditorV2', () => {
  let wrapper
  let stores

  const props = {
    datasetError: false,
    haveDataset: true,
    handleRetry: jest.fn(),
    setFocusOnSubmitButton: jest.fn(),
  }

  beforeAll(() => {
    stores = buildStores()
  })

  beforeEach(() => {
    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <Editor {...props} />
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>
    )
  })

  describe('given no dataset', () => {
    beforeAll(() => {
      props.haveDataset = false
    })

    afterAll(() => {
      props.haveDataset = true
    })

    test("it doesn't render (no dataset)", () => {
      expect(wrapper.html()).toBeFalsy()
    })
  })

  test('it renders all sections', () => {
    const sections = [{ component: DataOrigin }]

    sections.forEach(section => {
      const sectionWrapper = wrapper.find(section.component)
      expect(sectionWrapper).toHaveLength(1)
      expect(sectionWrapper.html()).toBeTruthy()
    })
  })

  describe('DataOrigin', () => {
    describe('when selecting IDA catalog', () => {
      let idaButtonWrapper
      beforeAll(() => {
        idaButtonWrapper = wrapper.find('CatalogButton#ida-catalog-btn')
        idaButtonWrapper.simulate('click')
      })

      test('should show additional components', () => {
        const filePickerWrapper = wrapper.find(FilePicker)
        const cumulativeWrapper = wrapper.find(CumulativeDataset)
        expect(filePickerWrapper).toHaveLength(1)
        expect(filePickerWrapper.html()).toBeTruthy()
        expect(cumulativeWrapper).toHaveLength(1)
        expect(cumulativeWrapper.html()).toBeTruthy()
      })

      describe('when de-selecting IDA catalog', () => {
        beforeAll(() => {
          idaButtonWrapper = wrapper.find('CatalogButton#ida-catalog-btn')
          idaButtonWrapper.simulate('click')
        })

        test('should hide additional components', () => {
          const filePickerWrapper = wrapper.find(FilePicker)
          const cumulativeWrapper = wrapper.find(CumulativeDataset)
          expect(filePickerWrapper).toHaveLength(0)
          expect(cumulativeWrapper).toHaveLength(0)
        })
      })
    })

    describe('when selecting ATT catalog', () => {
      let attButtonWrapper
      beforeAll(() => {
        attButtonWrapper = wrapper.find('CatalogButton#att-catalog-btn')
        attButtonWrapper.simulate('click')
      })

      test('should show additional components', () => {
        const listWrapper = wrapper.find('#att-catalog-list')
        const addWrapper = wrapper.find('#att-catalog-list-add')
        expect(listWrapper).toHaveLength(1)
        expect(listWrapper.html()).toBeTruthy()
        expect(addWrapper).toHaveLength(1)
        expect(addWrapper.html()).toBeTruthy()
      })

      describe('when de-selecting ATT catalog', () => {
        beforeAll(() => {
          attButtonWrapper = wrapper.find('CatalogButton#att-catalog-btn')
          attButtonWrapper.simulate('click')
        })

        test('should hide additional components', () => {
          const listWrapper = wrapper.find('#att-catalog-list')
          const addWrapper = wrapper.find('#att-catalog-list-add')
          expect(listWrapper).toHaveLength(0)
          expect(addWrapper).toHaveLength(0)
        })
      })
    })

    describe('given PAS catalog', () => {
      beforeAll(() => {
        stores.Qvain.setPreservationState(120)
      })

      afterAll(() => {
        stores.Qvain.setPreservationState(0)
      })

      test('should show PAS catalog as data origin', () => {
        const pasWrapper = wrapper.find(PasCatalog)
        expect(pasWrapper).toHaveLength(1)
        expect(pasWrapper.html()).toBeTruthy()
      })

      test('should hide IDA catalog and ATT catalog selection', () => {
        const attButtonWrapper = wrapper.find('#att-catalog-btn').hostNodes()
        const idaButtonWrapper = wrapper.find('#ida-catalog-btn').hostNodes()
        expect(attButtonWrapper).toHaveLength(0)
        expect(idaButtonWrapper).toHaveLength(0)
      })
    })
  })

  describe('Description section', () => {
    describe('when writing in description field', () => {
      beforeAll(() => {
        const descriptionFieldWrapper = wrapper.find('#description-input').hostNodes()
        descriptionFieldWrapper.simulate('change', { target: { value: 'abcd' } })
      })

      afterAll(() => {
        stores.Qvain.resetQvainStore()
      })

      test('should decrease the number of remaining characters', () => {
        const charCounter = wrapper.find('#description-char-counter').hostNodes()
        expect(charCounter).toHaveLength(1)
        expect(charCounter.text()).toEqual(expect.stringContaining('49996'))
      })
    })
  })
})
