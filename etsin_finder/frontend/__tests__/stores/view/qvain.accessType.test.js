import AccessType from '../../../js/stores/view/qvain/qvain.accessType'
import { ACCESS_TYPE_URL } from '../../../js/utils/constants'

describe('AccessType', () => {
  let accessType

  beforeEach(() => {
    accessType = new AccessType()
  })

  test('value should default to empty Model with open url', () => {
    const expectedValue = { name: undefined, url: ACCESS_TYPE_URL.OPEN }
    accessType.value.should.eql(expectedValue)
  })

  describe('when calling fromBackend', () => {
    beforeEach(() => {
      const mockDataset = {
        access_rights: {
          access_type: {
            pref_label: { en: 'name' },
            identifier: ACCESS_TYPE_URL.OPEN,
          },
        },
      }

      accessType.fromBackend(mockDataset)
    })

    test('should set value with correlating Model', () => {
      const expectedValue = {
        name: { en: 'name' },
        url: ACCESS_TYPE_URL.OPEN,
      }

      accessType.value.should.eql(expectedValue)
    })
  })
})
