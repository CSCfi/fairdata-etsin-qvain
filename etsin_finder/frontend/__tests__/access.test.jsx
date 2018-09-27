import axios from 'axios'
import Access from '../js/stores/view/access'
import auth from '../js/stores/domain/auth'

const accessTypes = {
  open: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open_access',
  closed: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/closed_access',
  embargoed: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/embargoed_access',
  restricted_access:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access',
  restricted_access_permit_fairdata:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_fairdata',
  restricted_access_permit_external:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_permit_external',
  restricted_access_research:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_research',
  restricted_access_research_education_studying:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_education_studying',
  restricted_access_registration:
    'http://uri.suomi.fi/codelist/fairdata/access_type/code/restricted_access_registration',
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
  describe('Update for closed access', () => {
    it('Should start update process', done => {
      const closed = accessRights
      closed.access_type.identifier = accessTypes.closed
      Access.updateAccess(closed)
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
  describe('Update for embargoed access', () => {
    describe('Is available', () => {
      it('Should start update process', done => {
        const embargoed = accessRights
        const d = new Date()
        d.setFullYear(d.getFullYear() - 1)
        embargoed.available = d.toISOString()
        embargoed.access_type.identifier = accessTypes.embargoed
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
        embargoed.access_type.identifier = accessTypes.embargoed
        Access.updateAccess(embargoed)
        done()
      })
      it('Should not show Remote files', () => {
        expect(Access.restrictions.allowRemote).toEqual(false)
      })
      it('Should not allow Remote file download', () => {
        expect(Access.restrictions.allowRemoteDownload).toEqual(false)
      })
      it('Should not show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(false)
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
      restricted.access_type.identifier = accessTypes.restricted_access
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
  describe('Update for restricted access permit fairdata', () => {
    it('Should start update process', done => {
      const permit_fairdata = accessRights
      permit_fairdata.access_type.identifier = accessTypes.restricted_access_permit_fairdata
      Access.updateAccess(permit_fairdata)
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
  describe('Update for restricted access permit external', () => {
    it('Should start update process', done => {
      const permit_external = accessRights
      permit_external.access_type.identifier = accessTypes.restricted_access_permit_external
      Access.updateAccess(permit_external)
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
  describe('Update for restricted access research', () => {
    it('Should start update process', done => {
      const restricted_research = accessRights
      restricted_research.access_type.identifier = accessTypes.restricted_access_research
      Access.updateAccess(restricted_research)
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
  describe('Update for restricted access research education studying', () => {
    describe('User not logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = false
        const restricted_research_studying = accessRights
        restricted_research_studying.access_type.identifier =
          accessTypes.restricted_access_research_education_studying
        Access.updateAccess(restricted_research_studying)
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
        const restricted_research_studying = accessRights
        restricted_research_studying.access_type.identifier =
          accessTypes.restricted_access_research_education_studying
        Access.updateAccess(restricted_research_studying)
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
  describe('Update for restricted access registration', () => {
    describe('User not logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = false
        const restricted_registration = accessRights
        restricted_registration.access_type.identifier = accessTypes.restricted_access_registration
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
        restricted_registration.access_type.identifier = accessTypes.restricted_access_registration
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
