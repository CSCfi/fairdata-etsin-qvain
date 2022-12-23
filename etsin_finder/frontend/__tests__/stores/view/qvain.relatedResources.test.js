import { expect } from 'chai'
import { makeObservable } from 'mobx'

import RelatedResources, {
  RelatedResource,
  RelatedResourceModel,
} from '@/stores/view/qvain/qvain.relatedResources'

import { buildStores } from '@/stores'

jest.mock('mobx')

describe('RelatedResources', () => {
  const Stores = buildStores()
  const relatedResources = Stores.Qvain.RelatedResources

  describe('given storage', () => {
    const item = {
      uiid: 1,
      name: 'name',
      description: 'description',
      identifier: 'identifier',
      entityType: { url: 'entityType' },
      relationType: { url: 'relationType' },
    }

    const item2 = {
      uiid: 2,
      name: 'name2',
      description: 'description2',
      relationType: { url: 'relationType2' },
    }

    const storage = [item, item2]

    beforeEach(() => {
      relatedResources.storage = storage
    })

    describe('when calling constructor with Parent', () => {
      test('should call super.constructor with Parent, RelatedResourceModel and "relatedResources"', () => {
        const expectedProps = {
          Template: RelatedResource,
          Model: RelatedResourceModel,
          fieldName: 'relatedResources',
        }

        Object.keys(expectedProps).forEach(key => {
          expect(relatedResources[key]).to.deep.equal(expectedProps[key])
        })
      })

      test('should call makeObservable', () => {
        expect(makeObservable).to.have.beenCalledWith(relatedResources)
      })
    })

    describe('when calling toBackend', () => {
      let returnValue

      beforeEach(() => {
        returnValue = relatedResources.toBackend()
      })

      test('should map storage items into backend items', () => {
        const expectedReturn = [
          {
            entity: {
              title: 'name',
              description: 'description',
              identifier: 'identifier',
              type: { identifier: 'entityType' },
            },
            relation_type: { identifier: 'relationType' },
          },

          {
            entity: {
              title: 'name2',
              description: 'description2',
              identifier: '',
              type: undefined,
            },
            relation_type: { identifier: 'relationType2' },
          },
        ]

        returnValue.should.deep.eql(expectedReturn)
      })
    })

    describe('when calling fromBackend', () => {
      let returnValue

      const dataset = {
        relation: ['relation'],
      }

      const Qvain = {
        some: 'data',
      }

      beforeEach(() => {
        relatedResources.fromBackendBase = jest.fn()
        returnValue = relatedResources.fromBackend(dataset, Qvain)
      })

      test('should call fromBackendBase with dataset.relation and Qvain', () => {
        expect(relatedResources.fromBackendBase).to.have.beenCalledWith(dataset.relation, Qvain)
      })
    })
  })
})
