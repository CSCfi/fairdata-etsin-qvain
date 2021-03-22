import React from 'react'
import { shallow, mount } from 'enzyme'

import { ThemeProvider } from 'styled-components'
import theme from '../../js/styles/theme'

jest.mock('../../js/stores/stores')

export default class ComponentTestHarness {
  constructor(Component, requiredProps) {
    this.Component = Component
    this.requiredProps = requiredProps
    this.wrappers = {}
  }

  shallow = extraProps => {
    const parsedProps = this.parseProps(extraProps)
    this.wrapper = shallow(<this.Component {...parsedProps} />)
    return this
  }

  mount = extraProps => {
    const parsedProps = this.parseProps(extraProps)
    this.wrapper = mount(
      <ThemeProvider theme={theme}>
        <this.Component {...parsedProps} />
      </ThemeProvider>
    )
    return this
  }

  unmount = async () => {
    this.wrapper.unmount()
    return this
  }

  storeWrapper = wrapperLabel => {
    this.wrappers[wrapperLabel] = this.wrapper
  }

  getWrapper = label => {
    if (!label) return this.wrapper
    return this.wrappers[label]
  }

  find = findTerm => {
    this.wrapper = this.wrapper.find(findTerm)
    return this
  }

  findWithProp = (prop, value) => {
    this.wrapper = this.wrapper.findWhere(elem => elem.prop(prop) === value)
    return this
  }

  diveInto = findTerm => {
    this.wrapper = this.wrapper.find(findTerm).dive()
    return this
  }

  originalAsNewHarness = () => {
    const harness = new ComponentTestHarness(this.Component, this.requiredProps)
    return harness
  }

  parseProps = extraProps => {
    return { ...this.requiredProps, ...extraProps }
  }

  get props() {
    return this.wrapper.props()
  }

  shouldIncludeProps = expectedProps => {
    this.props.should.deep.include(expectedProps)
  }

  shouldExist(findTerm) {
    if (!findTerm) {
      this.wrapper.exists().should.eql(true, "Component doesn't exist")
      return this.wrapper
    }

    const component = this.wrapper.find(findTerm)
    component.exists().should.eql(true, "Component doesn't exist")
    return component
  }

  debug = () => {
    console.log(this.wrapper.debug())
  }
}
