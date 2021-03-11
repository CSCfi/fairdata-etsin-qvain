import React from 'react'
import { shallow, mount } from 'enzyme'

import { ThemeProvider } from 'styled-components'
import theme from '../../js/styles/theme'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class ComponentTestHarness {
  constructor(Component, requiredProps) {
    this.Component = Component
    this.requiredProps = requiredProps
  }

  shallow = extraProps => {
    const parsedProps = this.parseProps(extraProps)
    this.wrapper = shallow(<this.Component {...parsedProps} />)
  }

  mount = extraProps => {
    const parsedProps = this.parseProps(extraProps)
    this.wrapper = mount(
      <ThemeProvider theme={theme}>
        <this.Component {...parsedProps} />
      </ThemeProvider>
    )
  }

  unmount = async () => {
    this.wrapper.unmount()
  }

  parseProps = extraProps => {
    return { ...this.requiredProps, ...extraProps }
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
}
