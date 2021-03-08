import React from 'react'
import 'chai/register-expect'
import { shallow } from 'enzyme'

import SelectedItems from '../../../js/components/qvain/general/modal/selectedItems'
import { useStores } from '../../../js/stores/stores'
import Label from '../../../js/components/qvain/general/card/label'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

jest.mock('../../../js/stores/stores')

useStores.mockReturnValue({
  Locale: {
    lang: 'en',
  },
})

describe('SelectedItems', () => {
  let selectedItems
  let item = {
    name: {
      en: 'name',
    },
    url: 'url',
  }

  const props = {
    getter: [item],
    handleClick: jest.fn(),
    noItems: '',
  }

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    selectedItems = shallow(<SelectedItems {...parsedProps} />)
  }

  describe('given required props (with one item)', () => {
    beforeEach(() => {
      render()
    })

    describe('Label', () => {
      let label

      beforeEach(() => {
        label = selectedItems.find(Label)
      })

      test('should exist', () => {
        label.exists().should.be.true
      })
    })

    describe('PaddedWord (span)', () => {
      let paddedWord

      beforeEach(() => {
        paddedWord = selectedItems.find('selectedItems__PaddedWord')
      })

      test('should exist', () => {
        paddedWord.exists().should.be.true
      })

      test('should have text item.name[lang]', () => {
        paddedWord.text().should.include(item.name.en)
      })
    })

    describe('FontAwesomeIcon', () => {
      let icon

      beforeEach(() => {
        icon = selectedItems.find(FontAwesomeIcon)
      })

      describe('when triggering click', () => {
        beforeEach(() => {
          icon.simulate('click')
        })

        test('should call handleClick with item', () => {
          expect(props.handleClick).to.have.beenCalledWith(item)
        })
      })
    })
  })

  describe('given required props with no items', () => {
    let noItems = 'no items'
    beforeEach(() => {
      render({ noItems, getter: [] })
    })

    test('should have Translate with content: noItems', () => {
      const translate = selectedItems.findWhere(elem => elem.props().content === noItems)
      translate.exists().should.be.true
    })
  })
})
