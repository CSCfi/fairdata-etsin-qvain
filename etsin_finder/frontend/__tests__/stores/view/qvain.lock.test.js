import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { observable, makeObservable, when, action } from 'mobx'

import LockClass from '../../../js/stores/view/qvain/qvain.lock'

const mockAdapter = new MockAdapter(axios)
window.fetch = jest.fn()

class FakeQvainClass {
  // Helper class that allows changing dataset identifier,
  // normally datasetIdentifier is a computed from original.identifier

  constructor() {
    makeObservable(this, { datasetIdentifier: observable, setDatasetIdentifier: action })
  }

  datasetIdentifier = undefined

  setDatasetIdentifier(id) {
    this.datasetIdentifier = id
  }
}

const Auth = {
  userName: 'test_user',
}

describe('things', () => {
  const setup = () => {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.useFakeTimers('modern')
    mockAdapter.reset()
    mockAdapter.onDelete().reply(200, {})
    const Qvain = new FakeQvainClass()
    const Lock = new LockClass(Qvain, Auth)
    return { Qvain, Lock }
  }

  const mockRequestLock = data => {
    mockAdapter.onPut().reply(200, data)
  }

  const mockRequestLockReject = (data, forceData) => {
    mockAdapter.onPut().reply(request => {
      const force = JSON.parse(request.data).force
      if (force) {
        return [200, forceData]
      }
      return [400, data]
    })
  }

  describe('when lock is available for user', () => {
    const setupLockAvailable = async () => {
      const { Qvain, Lock } = setup()
      Qvain.setDatasetIdentifier('datasetti')
      mockRequestLock({
        cr_id: 'datasetti',
        user_id: 'test_user',
      })
      Lock.enable()
      await when(() => !Lock.isPolling)
      return { Lock }
    }

    it('should get lock', async () => {
      const { Lock } = await setupLockAvailable()
      Lock.lockData.user.should.be.string('test_user')
      Lock.haveLock.should.be.true
    })

    it('should keep polling', async () => {
      const { Lock } = await setupLockAvailable()
      mockAdapter.history.put.length.should.eqls(1)

      for (let i = 2; i < 10; i++) {
        Lock.isPolling.should.be.false
        jest.advanceTimersByTime(Lock.pollInterval)
        Lock.isPolling.should.be.true
        await when(() => !Lock.isPolling)
        mockAdapter.history.put.length.should.eqls(i)
      }
    })
  })

  describe('when another user has lock', () => {
    const setupAnotherUserHasLock = async () => {
      const { Qvain, Lock } = setup()
      Qvain.setDatasetIdentifier('datasetti')
      mockRequestLockReject(
        {
          cr_id: 'datasetti',
          user_id: 'some_other_user',
        },
        {
          cr_id: 'datasetti',
          user_id: 'test_user',
        }
      )
      Lock.enable()
      await when(() => !Lock.isPolling)
      return { Lock }
    }

    it('should fail to get lock', async () => {
      const { Lock } = await setupAnotherUserHasLock()
      Lock.lockData.user.should.be.string('some_other_user')
      Lock.haveLock.should.be.false
    })

    it('should keep polling', async () => {
      const { Lock } = await setupAnotherUserHasLock()
      mockAdapter.history.put.length.should.eqls(1)

      for (let i = 2; i < 10; i++) {
        jest.advanceTimersByTime(Lock.pollInterval)
        await when(() => !Lock.isPolling)
        mockAdapter.history.put.length.should.eqls(i)
      }
    })

    it('should acquire lock if using force', async () => {
      const { Lock } = await setupAnotherUserHasLock()
      await Lock.request({ force: true })
      Lock.lockData.user.should.be.string('test_user')
      Lock.haveLock.should.be.true
    })
  })

  describe('when dataset changes', () => {
    it('should release previous lock', async () => {
      const { Qvain, Lock } = setup()
      Qvain.setDatasetIdentifier('datasetti')
      Lock.setLockData('datasetti', 'test_user')
      Lock.enable()
      Qvain.setDatasetIdentifier(undefined)
      mockAdapter.history.delete[0].url.should.eql('/api/qvain/datasets/datasetti/lock')
      Lock.lockData.should.eqls({ dataset: undefined, user: undefined })
    })

    it('should request new lock', async () => {
      const { Qvain, Lock } = setup()
      Lock.lockData = {
        dataset: 'datasetti',
        user: 'test_user',
      }
      Lock.enable()
      Qvain.setDatasetIdentifier('datasetti')
      mockAdapter.history.put[0].url.should.eql('/api/qvain/datasets/datasetti/lock')
      mockAdapter.history.put[0].data.should.eql(JSON.stringify({ force: false }))
    })

    it('should release lock with fetch when unload is called', () => {
      const { Lock } = setup()
      Lock.setLockData('datasetti', 'test_user')
      Lock.enable()
      Lock.unload()
      expect(window.fetch).to.have.beenCalledWith('/api/qvain/datasets/datasetti/lock', {
        keepalive: true,
        method: 'DELETE',
      })
    })
  })

  describe('when no dataset is open', () => {
    it('should not do anything', async () => {
      const { Lock } = setup()
      Lock.enable()
      jest.advanceTimersByTime(Lock.pollInterval * 100)
      Lock.pollingEnabled.should.be.false
      mockAdapter.history.put.length.should.eql(0)
      mockAdapter.history.delete.length.should.eql(0)
    })

    it('should not call fetch when unload is called', () => {
      const { Lock } = setup()
      Lock.enable()
      Lock.unload()
      expect(window.fetch).not.to.have.beenCalled()
    })
  })
})
