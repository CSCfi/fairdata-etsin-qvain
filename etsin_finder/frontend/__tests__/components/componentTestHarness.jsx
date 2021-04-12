import React from 'react'
import { shallow, mount } from 'enzyme'

import { ThemeProvider } from 'styled-components'
import theme from '../../js/styles/theme'

jest.mock('../../js/stores/stores')

export default class ComponentTestHarness {
  constructor(Component, requiredProps, label) {
    this.Component = Component
    this.requiredProps = requiredProps
    this.wrappers = {}
    this.currentLabel = label || '[Anonymous component]'
  }

  shallow = extraProps => {
    const parsedProps = this.parseProps(extraProps)
    this.wrapper = shallow(<this.Component {...parsedProps} />)
    this.wrappers.root = this.wrapper
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

  update = () => {
    this.wrappers.root.update()
  }

  storeWrapper = wrapperLabel => {
    this.wrappers[wrapperLabel] = this.wrapper
  }

  restoreWrapper = label => {
    if (label) this.wrapper = this.wrappers[label]
    return this.wrapper
  }

  getWrapper = label => {
    if (!label) return this.wrapper
    return this.wrappers[label]
  }

  find = findTerm => {
    this.wrapper = this.wrapper.find(findTerm)
    return this
  }

  findWithName = name => {
    this.wrapper = this.wrapper.findWhere(elem => elem.name()?.includes(name))
    return this
  }

  findWithProp = (prop, value) => {
    this.wrapper = this.wrapper.findWhere(elem => elem.prop(prop) === value)
    return this
  }

  dive = () => {
    this.wrapper = this.wrapper.dive()
    return this.wrapper
  }

  diveInto = findTerm => {
    this.wrapper = this.wrapper.find(findTerm).dive()
    return this
  }

  getOriginalWrapper = () => {
    return this.wrappers.root
  }

  originalAsNewHarness = () => {
    const harness = new ComponentTestHarness(this.Component, this.requiredProps)
    return harness
  }

  parseProps = extraProps => {
    return { ...this.requiredProps, ...extraProps }
  }

  get props() {
    if (this.wrapper.length !== 1) {
      fail(
        `Wrapper has more than one component, wrapper includes following components: \n${this.wrapper
          .children()
          .map(child => child.name())
          .join('\n')}`
      )
      return
    }

    return this.wrapper.props()
  }

  get children() {
    return this.wrapper.children()
  }

  trigger = (eventType, event) => {
    this.wrapper.simulate(eventType, event)
  }

  shouldIncludeProps = expectedProps => {
    this.props.should.deep.include(
      expectedProps,
      `in ${this.currentLabel}: Did not include expected props`
    )
  }

  shouldExist = findTerm => {
    if (!findTerm) {
      this.wrapper.exists().should.eql(true, `Component ${this.currentLabel} doesn't exist`)
      return this.wrapper
    }

    const component = this.wrapper.find(findTerm)
    component.exists().should.eql(true, `Component doesn't exist: ${findTerm.toString()}`)
    return component
  }

  shouldHaveKey = key => {
    this.wrapper.key().should.eql(key, `in ${this.currentLabel}: did not find expected key`)
  }

  shouldHaveText = text => {
    this.wrapper.text().should.include(text, `in ${this.currentLabel}: did not find expected text`)
  }

  shouldIncludeChildren = (testableList, props = {}) => {
    this.storeWrapper('__parent__')
    testableList.forEach(item => {
      this.shouldIncludeChild({ ...item, props: props[item.label] })
      this.restoreWrapper('__parent__')
    })
  }

  shouldIncludeChild = ({ findType = 'any', findArgs, props, label, key, text }) => {
    if (!findArgs) {
      fail(`in ${label}: findArgs is missing.`)
    }

    this.currentLabel = label || '[Anonymous component]'
    this.findTestableItem(findType, findArgs)
    this.shouldExist()

    if (props) this.shouldIncludeProps(props)
    if (label) this.storeWrapper(label)
    if (key) this.shouldHaveKey(key)
    if (text) this.shouldHaveText(text)
  }

  findTestableItem = (findType, findArgs) => {
    switch (findType) {
      case 'name':
        return this.findWithName(findArgs)
      case 'prop':
        return this.findWithProp(...findArgs)
      default:
        return this.find(findArgs)
    }
  }

  debug = () => {
    console.log(this.wrapper.debug())
  }
}
