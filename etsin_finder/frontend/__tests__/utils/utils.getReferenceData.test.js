import { expect } from 'chai'
import axios from 'axios'

import getReferenceData, {
  getLocalizedOptions,
} from '../../js/components/qvain/utils/getReferenceData'
import { METAX_FAIRDATA_ROOT_URL } from '../../js/utils/constants'

jest.mock('axios')

describe('when calling getReferenceData with string', () => {
  const refData = 'refData'

  beforeEach(() => {
    getReferenceData(refData)
  })

  test('should call axios.get with expected url', () => {
    const expectedUrl = `${METAX_FAIRDATA_ROOT_URL}/es/reference_data/${refData}/_search?size=1000`
    expect(axios.get).to.have.beenCalledWith(expectedUrl)
  })
})

describe('when calling getLocalizedOptions with a string', () => {
  let returnValue
  const field = 'field'

  beforeEach(async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: {
          hits: {
            hits: [
              {
                _source: {
                  uri: 'uri',
                  label: {
                    fi: 'fi_label',
                    en: 'en_label',
                  },
                },
              },
            ],
          },
        },
      })
    )

    returnValue = await getLocalizedOptions(field)
  })

  test('should return expected object', () => {
    const expectedReturn = {
      fi: [
        {
          value: 'uri',
          label: 'fi_label',
        },
      ],
      en: [
        {
          value: 'uri',
          label: 'en_label',
        },
      ],
    }

    returnValue.should.deep.eql(expectedReturn)
  })
})
