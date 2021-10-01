import 'chai/register-expect'
import { makeObservable } from 'mobx'

import Provenances, {
  Provenance,
  ProvenanceModel,
} from '../../../js/stores/view/qvain/qvain.provenances'

jest.mock('../../../js/stores/view/qvain/qvain.field', () => {
  class mockField {
    constructor(...args) {
      this.constructorFunction(...args)
    }

    reset() {
      this.parentReset()
    }

    setChanged = val => {
      this.changed = val
    }

    parentReset = jest.fn()
    fromBackendBase = jest.fn()
    constructorFunction = jest.fn()

    storage = []
  }

  return mockField
})

jest.mock('uuid')
jest.mock('mobx')

describe('Provenances', () => {
  let provenances

  const Qvain = {
    Actors: {
      actors: [],
    },
    createLooseProvenancePromise: jest.fn(),
  }

  beforeEach(() => {
    provenances = new Provenances(Qvain)
  })

  describe('when calling constructor', () => {
    test('should call makeObservables', () => {
      expect(makeObservable).to.have.beenCalledWith(provenances)
    })

    test('should call Field.constructor with expectedProps', () => {
      const expectedProps = [
        Qvain,
        Provenance,
        ProvenanceModel,
        'provenances',
        ['associations', 'usedEntities', 'locations'],
      ]

      expect(provenances.constructorFunction).to.have.beenCalledWith(...expectedProps)
    })

    describe('when calling saveAndClearLocations', () => {
      beforeEach(() => {
        provenances.selectedActor = 'selected'
        provenances.saveAndClearLocations()
      })

      test('should set selectedActor to undefined', () => {
        expect(provenances.selectedActor).to.be.undefined
      })
    })

    describe('when calling reset', () => {
      beforeEach(() => {
        provenances.selectedActor = 'selected'
        provenances.provenancesWithNonExistingActors = ['something something something darkside']
        provenances.reset()
      })

      test('should call parent reset', () => {
        expect(provenances.parentReset).to.have.beenCalledWith()
      })

      test('should set selectedActor to undefined', () => {
        expect(provenances.selectedActor).to.be.undefined
      })

      test('should set provenancesWithNonExistingActors to empty array', () => {
        provenances.provenancesWithNonExistingActors.should.eql([])
      })
    })

    describe('when calling create', () => {
      beforeEach(() => {
        provenances.changed = true
        provenances.create()
      })

      test('should set changed to false', () => {
        provenances.changed.should.be.false
      })

      test('should set inEdit with new Provenance', () => {
        const expectedObj = {
          associations: {
            ...Qvain.Actors,
            actorsRef: {},
          },
          description: {
            en: '',
            fi: '',
            und: '',
          },
          endDate: undefined,
          lifecycle: undefined,
          name: {
            en: '',
            fi: '',
            und: '',
          },
          outcome: undefined,
          outcomeDescription: {
            en: '',
            fi: '',
            und: '',
          },
          locations: {
            storage: [],
          },
          startDate: undefined,
          uiid: undefined,
          usedEntities: {
            storage: [],
          },
        }

        provenances.inEdit.should.deep.include.keys(expectedObj)
      })
    })

    describe('when calling toBackend', () => {
      let returnValue
      const obj = {
        name: {
          fi: 'fi-name',
        },
        description: {
          fi: 'fi-desc',
          en: 'en-desc',
        },
        outcomeDescription: {
          fi: 'fi-outcomeDesc',
        },
        startDate: 1,
        endDate: 2,
        locations: { toBackend: jest.fn(() => []) },
        outcome: { url: 'outcome_identifier' },
        usedEntities: { toBackend: jest.fn() },
        associations: { toBackend: undefined },
        lifecycle: { url: 'lifecycle_identifier' },
      }

      beforeEach(() => {
        provenances.storage = [obj]
        returnValue = provenances.toBackend()
      })

      test('should return a backend capable object', () => {
        const expectedReturn = [
          {
            title: obj.name,
            description: obj.description,
            outcome_description: obj.outcomeDescription,
            temporal: {
              start_date: new Date(1).toISOString(),
              end_date: new Date(2).toISOString(),
            },
            spatial: undefined,
            event_outcome: { identifier: 'outcome_identifier' },
            used_entity: undefined,
            was_associated_with: undefined,
            lifecycle_event: { identifier: 'lifecycle_identifier' },
          },
        ]

        returnValue.should.deep.eql(expectedReturn)
      })

      test('should call spatials and usedEntities toBackend functions', () => {
        expect(obj.locations.toBackend).to.have.beenCalledWith()
        expect(obj.usedEntities.toBackend).to.have.beenCalledWith()
      })
    })

    describe('when calling fromBackend', () => {
      const dataset = { provenance: ['provenance'] }
      const Qvain = 'Qvain'

      beforeEach(() => {
        provenances.provenancesWithNonExistingActors = 'some value'
        provenances.fromBackend(dataset, Qvain)
      })

      test('should set provenancesWithNonExistingActors to empty array', () => {
        provenances.provenancesWithNonExistingActors.should.eql([])
      })

      test('should call super.fromBackendBase', () => {
        expect(provenances.fromBackendBase).to.have.beenCalledWith(dataset.provenance, Qvain)
      })
    })

    describe('when calling checkActorFromRefs with id that exists in storage', () => {
      const actor = {
        uiid: 1,
      }

      const storage = [
        {
          associations: {
            actorsRef: {
              1: {
                toBe: 'removed',
              },
            },
          },
        },
      ]

      beforeEach(() => {
        provenances.storage = storage
        provenances.checkActorFromRefs(actor)
      })

      test('should set provenancesWithNonExistingActors', () => {
        provenances.provenancesWithNonExistingActors.should.eql(storage)
      })

      test('should call Qvain.createLooseProvenancePromise', () => {
        expect(Qvain.createLooseProvenancePromise).to.have.beenCalledWith()
      })
    })

    describe('when calling checkActorFromRefs with id that is not in storage', () => {
      let returnValue
      const actor = {
        uiid: 2,
      }

      const storage = [
        {
          associations: {
            actorsRef: {
              1: {
                toBe: 'removed',
              },
            },
          },
        },
      ]

      beforeEach(async () => {
        returnValue = await provenances.checkActorFromRefs(actor)
      })

      test('should return true', () => {
        returnValue.should.be.true
      })
    })
  })

  describe('when calling removeActorFromRefs', () => {
    const actor = {
      uiid: 1,
    }

    const storage = [
      {
        associations: {
          removeActorRef: jest.fn(),
        },
      },
      {
        associations: {
          removeActorRef: jest.fn(),
        },
      },
    ]

    beforeEach(() => {
      provenances.storage = storage
      provenances.removeActorFromRefs(actor)
    })

    test('should call removeActorRef from both provenances.associations', () => {
      expect(provenances.storage[0].associations.removeActorRef).to.have.beenCalledWith(1)
      expect(provenances.storage[1].associations.removeActorRef).to.have.beenCalledWith(1)
    })
  })
})
