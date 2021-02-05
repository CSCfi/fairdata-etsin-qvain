import React from 'react'
import { mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'
import { axe, toHaveNoViolations } from 'jest-axe'
import ReactModal from 'react-modal'

import etsinTheme from '../../../../js/styles/theme'
import '../../../../locale/translations'
import QvainContent from '../../../../js/components/qvain/views/main/index'
import stores from '../../../../js/stores'
import { StoresProvider } from '../../../../js/stores/stores'
import dataset from '../../../__testdata__/dataset.att'
import Section from '../../../../js/components/qvain/general/section/section'
import Field from '../../../../js/components/qvain/general/section/field'
import { ExpandCollapse } from '../../../../js/components/qvain/general/section/expand'

expect.extend(toHaveNoViolations)

describe('Qvain editor', () => {
  let wrapper, helper

  // open/close all visible sections
  const setSectionsExpanded = (wrapper, value) => {
    const sections = wrapper.find(Section)
    sections.forEach(section => section.instance().setState({ isExpanded: value }))
    wrapper.update()
  }

  // open/close all visible fields
  const setFieldsExpanded = (wrapper, value) => {
    const fields = wrapper.find(Field)
    fields.forEach(field => {
      const expander = field.find(ExpandCollapse).first()
      const enabled = expander.prop('isExpanded')
      if (enabled != value) {
        // toggles field by clicking expand button
        const button = expander.find('button').first()
        button.simulate('click')
      }
    })
    wrapper.update()
  }

  beforeEach(async () => {
    await stores.Qvain.editDataset(dataset)

    helper = document.createElement('div')
    document.body.appendChild(helper)
    ReactModal.setAppElement(helper)

    wrapper = mount(
      <StoresProvider store={stores}>
        <BrowserRouter>
          <ThemeProvider theme={etsinTheme}>
            <main>
              <QvainContent />
            </main>
          </ThemeProvider>
        </BrowserRouter>
      </StoresProvider>,
      { attachTo: helper }
    )
  })

  afterEach(() => {
    wrapper?.unmount?.()
    document.body.removeChild(helper)
  })

  it('is accessible with sections open', async () => {
    setSectionsExpanded(wrapper, true)
    setFieldsExpanded(wrapper, true)
    const results = await axe(wrapper.getDOMNode())
    expect(results).toHaveNoViolations()
  })

  it('is accessible with sections closed', async () => {
    setSectionsExpanded(wrapper, false)
    setFieldsExpanded(wrapper, false)
    const results = await axe(wrapper.getDOMNode())
    expect(results).toHaveNoViolations()
  })
})
