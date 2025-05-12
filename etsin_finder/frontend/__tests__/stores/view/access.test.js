import AccessClass from '../../../js/stores/view/access'
import AuthClass from '../../../js/stores/domain/auth'
import { ACCESS_TYPE_URL } from '../../../js/utils/constants'

const accessRights = {
  license: [
    {
      title: {
        en: 'Apache Software License 2.0',
        und: 'Apache Software License 2.0',
      },
      license: 'https://url.of.license.which.applies.here.org',
      url: 'http://uri.suomi.fi/codelist/fairdata/license/code/Apache-2.0',
      description: {
        en: 'Free account of the rights',
      },
    },
    {
      title: {
        en: 'Creative Commons Attribution-NonCommercial 2.0 Generic (CC BY-NC 2.0',
        fi: 'Creative Commons Nimeä-EiKaupallinen 2.0 Yleinen (CC BY-NC 2.0)',
        und: 'Creative Commons Nimeä-EiKaupallinen 2.0 Yleinen (CC BY-NC 2.0)',
      },
      license: 'https://creativecommons.org/licenses/by-nc/2.0/',
      url: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-NC-2.0',
      description: {
        en: 'Free account of the rights',
      },
    },
    {
      title: {
        en: 'Other',
        fi: 'Muu',
        und: 'Muu',
      },
      url: 'http://uri.suomi.fi/codelist/fairdata/license/code/other',
    },
  ],
  available: '2014-01-15',
  access_type: {
    in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
    url: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
    pref_label: {
      en: 'Open',
      fi: 'Avoin',
      und: 'Avoin',
    },
  },
  description: {
    en: 'Free account of the rights',
  },
  restriction_grounds: [
    {
      in_scheme: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds',
      url: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/other',
      pref_label: {
        en: 'Restricted access due to other reasons',
        fi: 'Saatavuutta rajoitettu muulla perusteella',
        sv: 'Begränsad åtkomst av övriga skäl',
        und: 'Saatavuutta rajoitettu muulla perusteella',
      },
    },
  ],
}

const Auth = new AuthClass()
const Access = new AccessClass(Auth)

describe('Access Store', () => {
  describe('Update for open access', () => {
    it('Should start update process', done => {
      const open = accessRights
      open.access_type.url = ACCESS_TYPE_URL.OPEN
      Access.updateAccess(open)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should allow IDA file download', () => {
      expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(true)
    })
    it('Should not show ask for access', () => {
      expect(Access.restrictions.showREMSbutton).toEqual(false)
    })
  })
  describe('Update for embargo access', () => {
    describe('Is available', () => {
      it('Should start update process', done => {
        const embargoed = accessRights
        const d = new Date()
        d.setFullYear(d.getFullYear() - 1)
        embargoed.available = d.toISOString()
        embargoed.access_type.url = ACCESS_TYPE_URL.EMBARGO
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should allow IDA file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(true)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
    describe('Unavailable', () => {
      it('Should start update process', done => {
        const embargoed = accessRights
        const d = new Date()
        d.setFullYear(d.getFullYear() + 1)
        embargoed.available = d.toISOString()
        embargoed.access_type.url = ACCESS_TYPE_URL.EMBARGO
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow IDA file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
  })
  describe('Update for restricted access', () => {
    it('Should start update process', done => {
      const restricted = accessRights
      restricted.access_type.url = ACCESS_TYPE_URL.RESTRICTED
      Access.updateAccess(restricted)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow IDA file download', () => {
      expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
    })
    it('Should not show ask for access', () => {
      expect(Access.restrictions.showREMSbutton).toEqual(false)
    })
  })
  describe('Update for permit access', () => {
    it('Should start update process', done => {
      const restricted_fairdata = accessRights
      restricted_fairdata.access_type.url = ACCESS_TYPE_URL.PERMIT
      restricted_fairdata.rems_approval_type = 'automatic'
      Access.updateAccess(restricted_fairdata)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow IDA file download', () => {
      expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
    })
    it('Should show ask for access', () => {
      expect(Access.restrictions.showREMSbutton).toEqual(true)
    })
  })
  describe('Update for login access', () => {
    describe('User not logged in', () => {
      it('Should start update process', done => {
        Auth.userLogged = false
        const restricted_registration = accessRights
        restricted_registration.access_type.url = ACCESS_TYPE_URL.LOGIN
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow IDA file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
    describe('User logged in', () => {
      it('Should start update process', done => {
        Auth.userLogged = true
        const restricted_registration = accessRights
        restricted_registration.access_type.url = ACCESS_TYPE_URL.LOGIN
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should allow IDA file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(true)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
  })
})
