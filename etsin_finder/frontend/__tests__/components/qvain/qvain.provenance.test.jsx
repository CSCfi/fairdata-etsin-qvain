import Harness from '../componentTestHarness'
import 'chai/register-expect'
import ReactSelect from 'react-select'
import translate from 'counterpart'

import Provenance from '../../../js/components/qvain/fields/history/provenance'
import ProvenanceFieldContent from '../../../js/components/qvain/fields/history/provenance/ProvenanceFieldContent'
import { useStores } from '../../../js/stores/stores'
import FieldList from '../../../js/components/qvain/general/section/fieldList'
import FieldListAdd from '../../../js/components/qvain/general/section/fieldListAdd'
import Form from '../../../js/components/qvain/fields/history/provenance/form'
import SpatialsForm from '../../../js/components/qvain/fields/temporalAndSpatial/spatial/form'
import UsedEntitiesForm from '../../../js/components/qvain/fields/history/relatedResource/form'
import {
  provenanceNameSchema,
  provenanceDateSchema,
} from '../../../js/components/qvain/utils/formValidation'
import TranslationTab from '../../../js/components/qvain/general/input/translationTab'
import Durationpicker from '../../../js/components/qvain/general/input/durationpicker'
import ActorsInput, {
  CustomOption,
} from '../../../js/components/qvain/fields/history/provenance/form/actorsInput'
import LocationInput from '../../../js/components/qvain/fields/history/provenance/form/locationInput'
import { Lifecycle, Outcome } from '../../../js/stores/view/qvain/qvain.provenances'
import UsedEntityInput from '../../../js/components/qvain/fields/history/provenance/form/usedEntityInput'
import { Label } from '../../../js/components/qvain/general/modal/form'
import ActorsList from '../../../js/components/qvain/fields/history/provenance/form/actorsList'
import { ROLE } from '../../../js/utils/constants'

jest.mock('../../../js/components/qvain/utils/formValidation', () => {
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
        },
        save: jest.fn(),
        clearInEdit: jest.fn(),
        setValidationError: jest.fn(),
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
          Field: mockStores.Qvain.Provenances,
          lang: 'en',
          translationsRoot: 'qvain.history.provenance',
        },
        FieldListAdd: {
          Store: mockStores.Qvain,
          Field: mockStores.Qvain.Provenances,
          translationsRoot: 'qvain.history.provenance',
          Form,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('FieldListAdd', () => {
    beforeEach(() => {
      harness.restoreWrapper('FieldListAdd')
    })

    describe('when calling handleSave and validations pass', () => {
      const { inEdit } = mockStores.Qvain.Provenances

      beforeEach(() => {
        provenanceNameSchema.validate.mockReturnValue(Promise.resolve())
        provenanceDateSchema.validate.mockReturnValue(Promise.resolve())
        harness.props.handleSave()
      })

      test('should call provenanceNameSchema.validate', () => {
        expect(provenanceNameSchema.validate).to.have.beenCalledWith(inEdit.name, { strict: true })
      })

      test('should call provenanceDateSchema.validate', () => {
        expect(provenanceDateSchema.validate).to.have.beenCalledWith(inEdit, {
          strict: true,
        })
      })

      test('should call Provenances.save', () => {
        expect(mockStores.Qvain.Provenances.save).to.have.beenCalledWith()
      })

      test('should call clearInEdit', () => {
        expect(mockStores.Qvain.Provenances.clearInEdit).to.have.beenCalledWith()
      })
    })

    describe('when calling handleSave and validations rejects', () => {
      const error = {
        message: 'hello',
      }

      beforeEach(async () => {
        provenanceNameSchema.validate.mockReturnValue(Promise.reject(error))
        harness.props.handleSave()
        await flushPromises()
      })

      test('should call setValidationError', () => {
        expect(mockStores.Qvain.Provenances.setValidationError).to.have.beenCalledWith(
          error.message
        )
      })
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
          spatials: {
            storage: [],
          },
          usedEntities: {
            storage: [],
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
    Store: mockStores.Qvain,
    Field: mockStores.Qvain.Provenances,
    translationsRoot: 'translationsRoot',
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
        { label: 'TranslationTab', findArgs: TranslationTab },
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
        {
          label: 'UsedEntityInput',
          findArgs: UsedEntityInput,
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
          language,
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
      harness.restoreWrapper('LocationInput')
      harness.dive()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'LocationLabel', findType: 'prop', findArgs: ['component', Label] },
        { label: 'LocationFieldList', findArgs: FieldList },
        { label: 'LocationFieldListAdd', findArgs: FieldListAdd },
      ]

      const translationsRoot = 'qvain.history.provenance.modal.locationInput'

      const props = {
        LocationLabel: {
          content: `${translationsRoot}.label`,
          htmlFor: 'location-input',
        },
        LocationFieldList: {
          Store: mockStores.Qvain.Provenances,
          Field: mockStores.Qvain.Provenances.inEdit.spatials,
          fieldIdentifier: 'spatials',
          lang: 'en',
          translationsRoot,
          disableNoItemsText: true,
        },
        LocationFieldListAdd: {
          Store: mockStores.Qvain.Provenances,
          Field: mockStores.Qvain.Provenances.inEdit.spatials,
          Form: SpatialsForm,
          translationsRoot,
          position: 'left',
          hideButton: false,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('LocationInput', () => {
    beforeEach(() => {
      harness.restoreWrapper('UsedEntityInput')
      harness.dive()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'UsedEntityLabel', findType: 'prop', findArgs: ['component', Label] },
        { label: 'UsedEntityFieldList', findArgs: FieldList },
        { label: 'UsedEntityFieldListAdd', findArgs: FieldListAdd },
      ]

      const translationsRoot = 'qvain.history.provenance.modal.usedEntityInput'

      const props = {
        UsedEntityLabel: {
          content: `${translationsRoot}.label`,
          htmlFor: 'used-entity-input',
        },
        UsedEntityFieldList: {
          Store: mockStores.Qvain.Provenances,
          Field: mockStores.Qvain.Provenances.inEdit.usedEntities,
          fieldIdentifier: 'usedEntities',
          lang: 'en',
          translationsRoot: translationsRoot,
          disableNoItemsText: true,
        },
        LocationFieldListAdd: {
          Store: mockStores.Qvain.Provenances,
          Field: mockStores.Qvain.Provenances.inEdit.usedEntities,
          Form: UsedEntitiesForm,
          translationsRoot: translationsRoot,
          formProps: { hideRelationType: true },
          position: 'left',
          hideButton: false,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('ActorsInput', () => {
    const createButtonTranslation = 'createButton translation'
    beforeEach(() => {
      translate.mockReturnValue(createButtonTranslation)
      harness.restoreWrapper('ActorsInput')
      harness.dive()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'ActorsLabel', findType: 'prop', findArgs: ['component', Label] },
        { label: 'ActorsList', findArgs: ActorsList },
        { label: 'ActorsSelect', findType: 'prop', findArgs: ['component', ReactSelect] },
      ]

      const { inEdit } = mockStores.Qvain.Provenances

      const translationsRoot = 'qvain.history.provenance.modal.actorsInput'

      const expectedProps = {
        ActorsLabel: {
          content: `${translationsRoot}.label`,
          htmlFor: 'actors-input',
        },
        ActorsList: {
          language: 'en',
          actors: inEdit.associations,
          items: [],
        },
        ActorsSelect: {
          inputId: 'actors-select',
          attributes: { placeholder: `${translationsRoot}.placeholder` },
          options: [
            {
              label: createButtonTranslation,
              value: 'create-actor',
            },
          ],
          components: { Option: CustomOption },
          value: inEdit.selectedActor,
          menuPlacement: 'auto',
          menuPosition: 'fixed',
          menuShouldScrollIntoView: false,
          isClearable: true,
          isDisabled: false,
        },
      }

      harness.shouldIncludeChildren(children, expectedProps)
    })
  })

  describe('ActorsSelect', () => {
    beforeEach(() => {
      harness.restoreWrapper('ActorsSelect')
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
