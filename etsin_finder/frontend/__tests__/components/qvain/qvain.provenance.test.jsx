import Harness from '../componentTestHarness'
import { expect } from 'chai'
import ReactSelect from 'react-select'
import translate from 'counterpart'
import { setImmediate } from 'timers'

import { Lifecycle, Outcome } from '@/stores/view/qvain/qvain.provenances'
import { ROLE } from '@/utils/constants'
import { Title } from '@/components/qvain/general/V2'
import { useStores } from '@/stores/stores'
import ActorsInput from '@/components/qvain/sections/History/Form/ActorsInput'
import ActorsList from '@/components/qvain/sections/History/Form/ActorsList'
import Durationpicker from '@/components/qvain/general/V2/Durationpicker'
import FieldList from '@/components/qvain/general/V2/FieldList'
import FieldListAdd from '@/components/qvain/general/V2/FieldListAdd'
import Form from '@/components/qvain/sections/History/Form'
import LocationInput from '@/components/qvain/sections/History/Form/LocationInput'
import ModalFieldList from '@/components/qvain/general/V2/ModalFieldList'
import ModalFieldListAdd from '@/components/qvain/general/V2/ModalFieldListAdd'
import Provenance from '@/components/qvain/sections/History'
import ProvenanceFieldContent from '@/components/qvain/sections/History/ProvenanceFieldContent'

jest.mock('@/stores/view/qvain/qvain.submit.schemas', () => {
  return {
    provenanceNameSchema: {
      validate: jest.fn(),
    },
    provenanceDateSchema: {
      validate: jest.fn(),
    },
  }
})

jest.mock('counterpart')

const flushPromises = () => new Promise(setImmediate)

describe('Provenance', () => {
  const mockStores = {
    Qvain: {
      Provenances: {
        inEdit: {
          name: {
            fi: 'fi-name',
            en: 'en-name',
          },
          startDate: 'startDate',
          endDate: 'endDate',
          locations: {
            storage: [],
            translationsRoot: 'locations translationsRoot',
          },
        },
        save: jest.fn(),
        clearInEdit: jest.fn(),
        setValidationError: jest.fn(),
        schema: {
          validate: jest.fn(),
        },
        translationsRoot: 'provenance translationsRoot',
        associationsTranslationsRoot: 'qvain.history.provenance.modal.actorsInput',
      },
    },
    Locale: {
      lang: 'en',
    },
  }

  const harness = new Harness(Provenance)

  beforeEach(async () => {
    useStores.mockReturnValue(mockStores)
    harness.shallow()
    await flushPromises()
    harness.diveInto('Provenance')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should exist', () => {
    harness.shouldExist()
  })

  test('should have have ProvenanceFieldContent', () => {
    const children = [{ label: 'ProvenanceFieldContent', findArgs: ProvenanceFieldContent }]

    harness.shouldIncludeChildren(children)
  })

  describe('ProvenanceFieldContent', () => {
    beforeEach(() => {
      harness.diveInto(ProvenanceFieldContent)
    })

    test('should have children with expectedProps', () => {
      const children = [
        { label: 'FieldList', findArgs: FieldList },
        { label: 'FieldListAdd', findArgs: FieldListAdd },
      ]

      const props = {
        FieldList: {
          fieldName: 'Provenances',
          lang: 'en',
        },
        FieldListAdd: {
          fieldName: 'Provenances',
          form: { Form, props: { Field: mockStores.Qvain.Provenances } },
        },
      }
      harness.shouldIncludeChildren(children, props)
    })
  })
})

describe('given required props and mockStores', () => {
  const mockStores = {
    Locale: {
      getMatchingLang: jest.fn(() => 'fi'),
      lang: 'en',
    },
    Qvain: {
      Provenances: {
        inEdit: {
          name: {
            fi: 'fi-name',
          },
          description: {
            fi: 'fi-description',
          },
          outcomeDescription: {
            fi: 'fi-outcome',
          },
          locations: {
            storage: [],
            translationsRoot: 'locations translationsRoot',
            edit: () => {},
            remove: () => {},
          },
          usedEntities: {
            storage: [],
            translationsRoot: 'usedEntities translationsRoot',
          },
          associations: {
            actorOptions: [],
            addActorWithId: jest.fn(),
            addRole: jest.fn(),
          },
          selectedActor: 'selectedActor',
        },
        changeAttribute: jest.fn(),
      },
      Actors: {
        actorOptions: [],
        editActor: jest.fn(),
      },
      readonly: false,
    },
  }

  const props = {
    Field: mockStores.Qvain.Provenances,
  }

  const harness = new Harness(Form, props)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Form', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'TranslationTab', findArgs: '#provenance-descriptions' },
        { label: 'NameTab', findType: 'prop', findArgs: ['datum', 'name'] },
        { label: 'DescriptionTab', findType: 'prop', findArgs: ['datum', 'description'] },
        {
          label: 'OutcomeDescriptionTab',
          findType: 'prop',
          findArgs: ['datum', 'outcomeDescription'],
        },
        { label: 'DurationPicker', findArgs: Durationpicker },
        { label: 'LocationInput', findArgs: LocationInput },
        {
          label: 'OutcomeInput',
          findType: 'prop',
          findArgs: ['datum', 'outcome'],
        },
        { label: 'ActorsInput', findArgs: ActorsInput },
        { label: 'LifecycleInput', findType: 'prop', findArgs: ['datum', 'lifecycle'] },
      ]

      const language = 'fi'

      const expectedProps = {
        TranslationTab: {
          language,
        },
        NameTab: {
          ...props,
          language,
          isRequired: true,
        },
        DescriptionTab: {
          ...props,
          language,
        },
        OutcomeDescriptionTab: {
          ...props,
          language,
        },
        DurationPicker: {
          ...props,
          datum: 'periodOfTime',
          language: 'en',
          id: 'provenance-period',
        },
        OutcomeInput: {
          ...props,
          metaxIdentifier: 'event_outcome',
          model: Outcome,
        },
        ActorsInput: {
          ...props,
          datum: 'actors',
        },
        LifecycleInput: {
          ...props,
          metaxIdentifier: 'lifecycle_event',
          model: Lifecycle,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })

  describe('LocationInput', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto(LocationInput)
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'LocationLabel', findType: 'prop', findArgs: ['component', Title] },
        { label: 'LocationFieldList', findArgs: ModalFieldList },
        { label: 'LocationFieldListAdd', findArgs: ModalFieldListAdd },
      ]

      const translationsRoot = 'locations translationsRoot'

      const props = {
        LocationLabel: {
          content: `${translationsRoot}.label`,
          htmlFor: 'location-input',
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('ActorsInput', () => {
    const createButtonTranslation = 'createButton translation'
    beforeEach(() => {
      translate.mockReturnValue(createButtonTranslation)
      harness.shallow()
      harness.diveInto(ActorsInput)
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'ActorsLabel', findType: 'prop', findArgs: ['component', Title] },
        { label: 'ActorsList', findArgs: ActorsList },
        { label: 'ActorsSelect', findType: 'prop', findArgs: ['component', ReactSelect] },
      ]

      const { associationsTranslationsRoot } = mockStores.Qvain.Provenances

      const expectedProps = {
        ActorsLabel: {
          content: `${associationsTranslationsRoot}.label`,
          htmlFor: 'actors-input',
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })

  describe('ActorsSelect', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto(ActorsInput)
      harness.diveInto({ component: ReactSelect })
    })

    describe('when triggering onChange with create-actor', () => {
      const selection = {
        value: 'create-actor',
      }

      beforeEach(() => {
        harness.trigger('change', selection)
      })

      test('should call editActor', () => {
        expect(mockStores.Qvain.Actors.editActor).to.have.beenCalled()
      })

      test('should call changeAttributes with null', () => {
        expect(mockStores.Qvain.Provenances.changeAttribute).to.have.beenCalledWith(
          'selectedActor',
          null
        )
      })
    })

    describe('when triggering onChange with any other value', () => {
      const selection = {
        value: 'some actor',
      }

      beforeEach(() => {
        harness.trigger('change', selection)
      })

      test('should call addActorWithId', () => {
        expect(
          mockStores.Qvain.Provenances.inEdit.associations.addActorWithId
        ).to.have.beenCalledWith(selection.value)
      })

      test('should call addRole', () => {
        expect(mockStores.Qvain.Provenances.inEdit.associations.addRole).to.have.beenCalledWith(
          selection.value,
          ROLE.PROVENANCE
        )
      })

      test('should call changeAttribute with selectedActor and undefined', () => {
        expect(mockStores.Qvain.Provenances.changeAttribute).to.have.beenCalledWith(
          'selectedActor',
          undefined
        )
      })
    })
  })
})
