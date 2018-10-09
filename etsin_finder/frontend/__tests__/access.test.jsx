import axios from 'axios'
import Access from '../js/stores/view/access'
import auth from '../js/stores/domain/auth'

const accessTypes = {
  open: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
  login: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/login',
  embargo: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo',
  permit: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/permit',
  restricted: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted'
}

let accessRights

describe('Access Store', () => {
  it('get data', done => {
    axios.get('https://metax-test.csc.fi/rest/datasets/13').then(response => {
      accessRights = response.data.research_dataset.access_rights
      done()
    })
  })
  describe('Update for open access', () => {
    it('Should start update process', done => {
      const open = accessRights
      open.access_type.identifier = accessTypes.open
      Access.updateAccess(open)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should allow Remote file download', () => {
      expect(Access.restrictions.allowRemoteDownload).toEqual(true)
    })
    it('Should allow Ida file download', () => {
      expect(Access.restrictions.allowDataDownload).toEqual(true)
    })
    it('Should show Ida file info', () => {
      expect(Access.restrictions.allowDataInfoButton).toEqual(true)
    })
    it('Should not show ask for access', () => {
      expect(Access.restrictions.allowAskForAccess).toEqual(false)
    })
  })
  describe('Update for embargo access', () => {
    describe('Is available', () => {
      it('Should start update process', done => {
        const embargoed = accessRights
        const d = new Date()
        d.setFullYear(d.getFullYear() - 1)
        embargoed.available = d.toISOString()
        embargoed.access_type.identifier = accessTypes.embargo
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowRemote).toEqual(true)
      })
      it('Should allow Remote file download', () => {
        expect(Access.restrictions.allowRemoteDownload).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should allow Ida file download', () => {
        expect(Access.restrictions.allowDataDownload).toEqual(true)
      })
      it('Should show Ida file info', () => {
        expect(Access.restrictions.allowDataInfoButton).toEqual(true)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.allowAskForAccess).toEqual(false)
      })
    })
    describe('Unavailable', () => {
      it('Should start update process', done => {
        const embargoed = accessRights
        const d = new Date()
        d.setFullYear(d.getFullYear() + 1)
        embargoed.available = d.toISOString()
        embargoed.access_type.identifier = accessTypes.embargo
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowRemote).toEqual(true)
      })
      it('Should allow Remote file download', () => {
        expect(Access.restrictions.allowRemoteDownload).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
        expect(Access.restrictions.allowDataDownload).toEqual(false)
      })
      it('Should not show Ida file info', () => {
        expect(Access.restrictions.allowDataInfoButton).toEqual(false)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.allowAskForAccess).toEqual(false)
      })
    })
  })
  describe('Update for restricted access', () => {
    it('Should start update process', done => {
      const restricted = accessRights
      restricted.access_type.identifier = accessTypes.restricted
      Access.updateAccess(restricted)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowRemote).toEqual(true)
    })
    it('Should allow Remote file download', () => {
      expect(Access.restrictions.allowRemoteDownload).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow Ida file download', () => {
      expect(Access.restrictions.allowDataDownload).toEqual(false)
    })
    it('Should not show Ida file info', () => {
      expect(Access.restrictions.allowDataInfoButton).toEqual(false)
    })
    it('Should not show ask for access', () => {
      expect(Access.restrictions.allowAskForAccess).toEqual(false)
    })
  })
  describe('Update for permit access', () => {
    it('Should start update process', done => {
      const restricted_fairdata = accessRights
      restricted_fairdata.access_type.identifier = accessTypes.permit
      Access.updateAccess(restricted_fairdata)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowRemote).toEqual(true)
    })
    it('Should allow Remote file download', () => {
      expect(Access.restrictions.allowRemoteDownload).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow Ida file download', () => {
      expect(Access.restrictions.allowDataDownload).toEqual(false)
    })
    it('Should not show Ida file info', () => {
      expect(Access.restrictions.allowDataInfoButton).toEqual(false)
    })
    it('Should show ask for access', () => {
      expect(Access.restrictions.allowAskForAccess).toEqual(true)
    })
  })
  describe('Update for login access', () => {
    describe('User not logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = false
        const restricted_registration = accessRights
        restricted_registration.access_type.identifier = accessTypes.login
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowRemote).toEqual(true)
      })
      it('Should allow Remote file download', () => {
        expect(Access.restrictions.allowRemoteDownload).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
        expect(Access.restrictions.allowDataDownload).toEqual(false)
      })
      it('Should not show Ida file info', () => {
        expect(Access.restrictions.allowDataInfoButton).toEqual(false)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.allowAskForAccess).toEqual(false)
      })
    })
    describe('User logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = true
        const restricted_registration = accessRights
        restricted_registration.access_type.identifier = accessTypes.login
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowRemote).toEqual(true)
      })
      it('Should allow Remote file download', () => {
        expect(Access.restrictions.allowRemoteDownload).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
        expect(Access.restrictions.allowDataDownload).toEqual(true)
      })
      it('Should not show Ida file info', () => {
        expect(Access.restrictions.allowDataInfoButton).toEqual(true)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.allowAskForAccess).toEqual(false)
      })
    })
  })
})
