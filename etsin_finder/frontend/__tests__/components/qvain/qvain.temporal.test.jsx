import Harness from '../componentTestHarness'
import { expect } from 'chai'

import TemporalFieldContent from '@/components/qvain/sections/TimePeriod/TemporalFieldContent'
import TemporalList, { RemoveButton } from '@/components/qvain/sections/TimePeriod/TemporalList'
import { useStores } from '../../../js/stores/stores'
import DurationPicker from '../../../js/components/qvain/general/V2/Durationpicker'
import { AddNewButton } from '../../../js/components/qvain/general/buttons'
import ValidationError from '../../../js/components/qvain/general/errors/validationError'
import Label from '../../../js/components/qvain/general/card/label'
import LocaleClass from '../../../js/stores/view/locale'

jest.mock('../../../js/stores/view/qvain/qvain.submit.schemas')

const mockStores = {
  Qvain: {
    Temporals: {
      storage: [],
      removeTemporal: jest.fn(),
      readonly: false,
      validationError: undefined,
      translationsRoot: 'translationsRoot',
      validateAndSave: jest.fn(),
    },
  },
  Locale: new LocaleClass(),
}

describe('given required props', () => {
  const lang = 'en'

  const harness = new Harness(TemporalFieldContent, {}, 'TemporalFieldContent')

  describe('TemporalFieldContent', () => {
    beforeEach(() => {
      useStores.mockReturnValue(mockStores)
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should include children with properties', () => {
      const children = [
        { label: 'TemporalList', findArgs: TemporalList },
        { label: 'DurationPicker', findArgs: DurationPicker },
        {
          label: 'AddNewButton',
          findType: 'prop',
          findArgs: ['component', AddNewButton],
        },
      ]

      const props = {
        TemporalList: {
          lang,
          temporals: mockStores.Qvain.Temporals.storage,
          remove: mockStores.Qvain.Temporals.removeTemporal,
          readonly: mockStores.Qvain.Temporals.readonly,
        },
        DurationPicker: {
          Field: mockStores.Qvain.Temporals,
          datum: 'duration',
          id: 'temporal-period',
        },
        AddNewButton: {
          content: 'translationsRoot.addButton',
          disabled: mockStores.Qvain.Temporals.readonly,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })

    describe('AddNewButton', () => {
      beforeEach(() => {
        harness.restoreWrapper('AddNewButton')
      })

      describe('when calling onClick', () => {
        beforeEach(() => {
          harness.props.onClick()
        })

        test('should call validateAndSave', () => {
          expect(mockStores.Qvain.Temporals.validateAndSave).to.have.beenCalledTimes(1)
        })
      })
    })
  })

  describe('given additional prop Store.Temporals.validationError', () => {
    beforeEach(() => {
      harness.restoreWrapper('TemporalFieldContent')
      useStores.mockReturnValue({
        ...mockStores,
        Qvain: {
          ...mockStores.Qvain,
          Temporals: {
            ...mockStores.Qvain.Temporals,
            validationError: 'validationError',
          },
        },
      })
      harness.shallow()
    })

    test('should have child ValidationError with text', () => {
      harness.shouldIncludeChild({
        label: 'ValidationError',
        findArgs: ValidationError,
      })
      harness.children.text().should.eql('validationError')
    })
  })
})

describe('given required props and with one item in temporals array', () => {
  const props = {
    temporals: [
      {
        startDate: 1,
        endDate: 2,
        uiid: 3,
      },
    ],
    lang: 'en',
    remove: jest.fn(),
  }

  const harness = new Harness(TemporalList, props)

  describe('TemporalList', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with props', () => {
      const children = [
        {
          label: 'DateLabel',
          findType: 'prop',
          findArgs: ['className', 'date-label'],
        },
      ]

      harness.shouldIncludeChildren(children)
    })

    describe('Label', () => {
      beforeEach(() => {
        harness.find(Label)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have key:item.uiid', () => {
        const key = props.temporals[0].uiid.toString()
        harness.wrapper.key().should.eql(key)
      })
    })

    describe('DateLabel', () => {
      beforeEach(() => {
        harness.restoreWrapper('DateLabel')
        harness.wrapper = harness.dive().first().dive()
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have parsed "item.startDate - item.endDate" in text', () => {
        const expectedText = '1970-01-01 – 1970-01-01'
        harness.wrapper.text().should.eql(expectedText)
      })
    })

    describe('Translate component:RemoveButton', () => {
      beforeEach(() => {
        harness.findWithProp('component', RemoveButton)
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      describe('when triggering click', () => {
        beforeEach(() => {
          harness.trigger('click')
        })

        test('should call remove with item.uiid', () => {
          const uiid = props.temporals[0].uiid
          expect(props.remove).to.have.beenCalledWith(uiid)
        })
      })
    })
  })
})

describe('given required props and with one partial item in temporals array', () => {
  const props = {
    temporals: [
      {
        startDate: undefined,
        endDate: 2,
        uiid: 3,
      },
    ],
    lang: 'en',
    remove: jest.fn(),
  }

  const harness = new Harness(TemporalList, props)

  describe('TemporalList', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with props', () => {
      const children = [
        {
          label: 'DateLabel',
          findType: 'prop',
          findArgs: ['className', 'date-label'],
        },
      ]

      harness.shouldIncludeChildren(children)
    })

    describe('DateLabel', () => {
      beforeEach(() => {
        harness.restoreWrapper('DateLabel')
      })

      test('should exist', () => {
        harness.shouldExist()
      })

      test('should have parsed "until <item.endDate>" in text', () => {
        const expectedText = 'until 1970-01-01'
        harness.wrapper = harness.wrapper.first().dive().dive()
        harness.wrapper.text().should.eql(expectedText)
      })
    })
  })
})
