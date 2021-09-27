import 'chai/register-expect'
import { makeObservable } from 'mobx'

import DatasetsV2 from '../../../js/stores/view/qvain/qvain.datasetsV2'

jest.mock('mobx')

const Datasets = {
  datasets: [1, 2, 3, 4],
  datasetGroups: [[1, 2, 3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14]],
}

describe('DatasetsV2', () => {
  let datasetsV2
  beforeEach(() => {
    datasetsV2 = new DatasetsV2(Datasets)
  })

  describe('when calling constructor', () => {
    test('should call makeObservable', () => {
      expect(makeObservable).to.have.beenCalledWith(datasetsV2)
    })

    it('should have default values', () => {
      datasetsV2.should.deep.include({
        showCount: { initial: 10, current: 10, increment: 10 },
      })
    })
  })

  it('should show more datasets', () => {
    const { showCount } = datasetsV2
    const oldCount = showCount.current
    datasetsV2.datasetGroups.length.should.eql(oldCount)
    datasetsV2.showMore()
    showCount.current.should.eql(oldCount + showCount.increment)
    datasetsV2.datasetGroups.length.should.eql(Datasets.datasetGroups.length)
  })
})
