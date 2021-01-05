import axios from 'axios'
import Access from '../../../js/stores/view/access'
import auth from '../../../js/stores/domain/auth'
import { ACCESS_TYPE_URL } from '../../../js/utils/constants'

// Replaces getting from metax test:
// axios.get('https://metax-test.csc.fi/rest/datasets/13').then(response => {
//   accessRights = response.data.research_dataset.access_rights
//   done()
// })
const accessRights = {
  license: [
    {
      title: {
        en: 'Apache Software License 2.0',
        und: 'Apache Software License 2.0',
      },
      license: 'https://url.of.license.which.applies.here.org',
      identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/Apache-2.0',
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
      identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-NC-2.0',
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
      identifier: 'http://uri.suomi.fi/codelist/fairdata/license/code/other',
    },
  ],
  available: '2014-01-15',
  access_url: {
    title: {
      en: 'A name given to the document',
    },
    identifier: 'https://access.url.com/landing',
    description: {
      en: 'Description of the link. For example to be used as hover text.',
    },
  },
  access_type: {
    in_scheme: 'http://uri.suomi.fi/codelist/fairdata/access_type',
    definition: {
      en: 'A statement or formal explanation of the meaning of a concept.',
    },
    identifier: 'http://uri.suomi.fi/codelist/fairdata/access_type/code/open',
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
      identifier: 'http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/other',
      pref_label: {
        en: 'Restricted access due to other reasons',
        fi: 'Saatavuutta rajoitettu muulla perusteella',
        sv: 'Begränsad åtkomst av övriga skäl',
        und: 'Saatavuutta rajoitettu muulla perusteella',
      },
    },
  ],
}

describe('Access Store', () => {
  describe('Update for open access', () => {
    it('Should start update process', done => {
      const open = accessRights
      open.access_type.identifier = ACCESS_TYPE_URL.OPEN
      Access.updateAccess(open)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should allow Ida file download', () => {
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
        embargoed.access_type.identifier = ACCESS_TYPE_URL.EMBARGO
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should allow Ida file download', () => {
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
        embargoed.access_type.identifier = ACCESS_TYPE_URL.EMBARGO
        Access.updateAccess(embargoed)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
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
      restricted.access_type.identifier = ACCESS_TYPE_URL.RESTRICTED
      Access.updateAccess(restricted)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow Ida file download', () => {
      expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
    })
    it('Should not show ask for access', () => {
      expect(Access.restrictions.showREMSbutton).toEqual(false)
    })
  })
  describe('Update for permit access', () => {
    it('Should start update process', done => {
      const restricted_fairdata = accessRights
      restricted_fairdata.access_type.identifier = ACCESS_TYPE_URL.PERMIT
      Access.updateAccess(restricted_fairdata)
      done()
    })
    it('Should show Remote files', () => {
      expect(Access.restrictions.allowDataRemote).toEqual(true)
    })
    it('Should show IDA files', () => {
      expect(Access.restrictions.allowDataIda).toEqual(true)
    })
    it('Should not allow Ida file download', () => {
      expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
    })
    it('Should show ask for access', () => {
      expect(Access.restrictions.showREMSbutton).toEqual(true)
    })
  })
  describe('Update for login access', () => {
    describe('User not logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = false
        const restricted_registration = accessRights
        restricted_registration.access_type.identifier = ACCESS_TYPE_URL.LOGIN
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(false)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
    describe('User logged in', () => {
      it('Should start update process', done => {
        auth.userLogged = true
        const restricted_registration = accessRights
        restricted_registration.access_type.identifier = ACCESS_TYPE_URL.LOGIN
        Access.updateAccess(restricted_registration)
        done()
      })
      it('Should show Remote files', () => {
        expect(Access.restrictions.allowDataRemote).toEqual(true)
      })
      it('Should show IDA files', () => {
        expect(Access.restrictions.allowDataIda).toEqual(true)
      })
      it('Should not allow Ida file download', () => {
        expect(Access.restrictions.allowDataIdaDownloadButton).toEqual(true)
      })
      it('Should not show ask for access', () => {
        expect(Access.restrictions.showREMSbutton).toEqual(false)
      })
    })
  })
})
