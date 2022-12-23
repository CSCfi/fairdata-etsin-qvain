import { shallow } from 'enzyme'
import React from 'react'
import { expect } from 'chai'

import ModalReferenceInput from '@/components/qvain/general/V2/ModalReferenceInput'
import { Title, Required } from '@/components/qvain/general/V2'
import Select from '@/components/qvain/general/V2/Select'
import SearchSelect from '@/components/qvain/general/V2/SearchSelect'

const Field = {
  changeAttribute: jest.fn(),
  inEdit: {
    datum: {},
  },
  translationsRoot: 'translationsRoot',
}

const props = {
  Field,
  datum: 'datum',
  model: jest.fn(),
  metaxIdentifier: 'metaxIdentifier',
}

describe('ModalRefenceInput', function () {
  let wrapper

  const getTranslations = props => ({
    label: `${Field.translationsRoot}.${props.datum}.label`,
    infoText: `${Field.translationsRoot}.${props.datum}.infoText`,
  })

  const render = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    wrapper = shallow(<ModalReferenceInput {...parsedProps} />)
  }

  const expectedSelectProps = {
    id: 'datum-input',
    name: 'datum',
    getter: {},
    model: props.model,
    metaxIdentifier: 'metaxIdentifier',
    inModal: true,
    isClearable: true,
  }

  beforeEach(() => {
    render()
  })

  test('should exist', () => {
    wrapper.exists().should.be.true
  })

  describe('given minimal props', () => {
    describe('Label', () => {
      let label

      beforeEach(() => {
        label = wrapper.find(Title)
      })

      test('should have htmlFor: datum-input', () => {
        label.props().htmlFor.should.eql('datum-input')
      })

      test('should have Translate content="translations.label"', () => {
        const translation = label.find({ content: getTranslations(props).label })
        translation.exists().should.be.true
      })
    })

    describe('Select', () => {
      let select

      beforeEach(() => {
        select = wrapper.find(Select)
      })

      test('should exist', () => {
        select.exists().should.be.true
      })

      test('should have expectedProps', () => {
        select.props().should.deep.include(expectedSelectProps)
      })

      describe('when calling setter with value', () => {
        const value = 'value'
        beforeEach(() => {
          select.props().setter(value)
        })

        test('should call Field.changeAttribute with datum and value', () => {
          expect(Field.changeAttribute).to.have.beenCalledWith(props.datum, value)
        })
      })
    })
  })

  describe('given search:true', () => {
    beforeEach(() => {
      render({ search: true })
    })

    describe('SearchSelect', () => {
      let searchSelect

      beforeEach(() => {
        searchSelect = wrapper.find(SearchSelect)
      })

      test('should exist', () => {
        searchSelect.exists().should.be.true
      })

      test('should have expectedProps', () => {
        searchSelect.props().should.deep.include(expectedSelectProps)
      })

      describe('when calling setter with value', () => {
        const value = 'value'
        beforeEach(() => {
          searchSelect.props().setter(value)
        })

        test('should call Field.changeAttribute with datum and value', () => {
          expect(Field.changeAttribute).to.have.beenCalledWith(props.datum, value)
        })
      })
    })
  })

  describe('given isRequired: true', () => {
    beforeEach(() => {
      render({ isRequired: true })
    })

    describe('Label', () => {
      test("should render '<Required />'", () => {
        wrapper.find('Required').should.have.lengthOf(1)
      })
    })
  })
})
