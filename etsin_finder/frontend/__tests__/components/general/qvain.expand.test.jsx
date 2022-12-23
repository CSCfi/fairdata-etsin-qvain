import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import {
  ExpandCollapse,
  IconStyles,
  NoStyleButton,
} from '../../../js/components/qvain/general/V2/ExpandCollapse'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

describe('ExpandCollapse', () => {
  let expandCollapse

  const render = props => {
    expandCollapse = shallow(<ExpandCollapse {...props} />)
  }

  describe('given no props', () => {
    beforeEach(() => {
      render()
    })

    test('should have IconStyles with icon:faPlus', () => {
      const iconStyles = expandCollapse.find(IconStyles)
      iconStyles.exists().should.be.true
      iconStyles.props().icon.should.eql(faPlus)
    })

    describe('Translate [component=NoStyleButton]', () => {
      let noStyleButton

      beforeEach(() => {
        noStyleButton = expandCollapse.findWhere(elem => elem.props().component === NoStyleButton)
      })

      test('should have expected props', () => {
        const expectedProps = {
          type: 'button',
          attributes: {
            'aria-label': 'general.showMore',
          },
        }

        noStyleButton.props().should.deep.include(expectedProps)
      })
    })
  })

  describe('given isExpand:true', () => {
    beforeEach(() => {
      render({ isExpanded: true })
    })

    test('should have IconStyles with icon:faMinus', () => {
      const iconStyles = expandCollapse.find(IconStyles)
      iconStyles.exists().should.be.true
      iconStyles.props().icon.should.eql(faMinus)
    })

    describe('Translate [component=NoStyleButton]', () => {
      let noStyleButton

      beforeEach(() => {
        noStyleButton = expandCollapse.findWhere(elem => elem.props().component === NoStyleButton)
      })

      test('should have attributes.aria-label: "general.showLess"', () => {
        noStyleButton.props().attributes.should.deep.eql({ 'aria-label': 'general.showLess' })
      })
    })
  })
})
