import Harness from '../componentTestHarness'
import ProjectV2 from '@/components/qvain/sections/Project'
import { useStores } from '@/stores/stores'
import Form from '@/components/qvain/sections/Project/Form'

jest.mock('@/stores/stores')

describe('given MockStores', () => {
  const mockStores = {
    Qvain: {
      ProjectV2: {
        storage: [],
      },
    },
  }

  const harness = new Harness(ProjectV2)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  describe('ProjectV2', () => {
    beforeEach(() => {
      harness.shallow()
      harness.diveInto('ProjectContent')
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'List', findArgs: 'FieldList' },
        { label: 'ListAdd', findArgs: 'FieldListAdd' },
      ]

      const props = {
        List: {
          fieldName: 'ProjectV2',
          disableNoItemsText: false,
        },
        ListAdd: {
          fieldName: 'ProjectV2',
          form: {
            Form,
            props: {
              Field: mockStores.Qvain.ProjectV2,
            },
          },
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
