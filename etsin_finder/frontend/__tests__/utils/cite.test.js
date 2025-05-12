import { buildStores } from '../../js/stores'
import Cite from '@/stores/view/etsin/cite'
import CitationBuilder from '@/stores/view/etsin/cite/citationBuilder'
import {
  getNameInitials,
  getLastnameFirst,
  getNameParts,
  getVersion,
  getIdentifier,
} from '@/stores/view/etsin/cite/utils'

const stores = buildStores()
const cite = new Cite({ Stores: stores.Etsin.EtsinDataset, Locale: stores.Locale })

const personDataset = {
  actors: [
    { roles: ['creator'], person: { name: 'Etunimi von Sukunimi' } },
    { roles: ['creator'], person: { name: 'Toinen Henkilö' } },
    { roles: ['publisher'], organization: { pref_label: { en: 'Publisher' } } },
  ],
  issued: '2021-02-23',
  title: { fi: 'Julkaisun nimi', en: 'Publication title' },
  persistent_identifier: 'urn:nbn:fi:att:feedc0de',
  id: 'metax_identifier_for_this_dataset',
}

const draftDataset = {
  ...personDataset,
  state: 'draft',
  id: undefined,
}

const organizationDataset = {
  actors: [
    {
      roles: ['creator'],
      organization: {
        pref_label: { en: 'Some suborganization', fi: 'Joku aliorganisaatio' },
        parent: {
          pref_label: { en: 'Top organization', fi: 'Pääorganisaatio' },
        },
      },
    },
    {
      roles: ['publisher'],
      organization: { pref_label: { en: 'Publisher', fi: 'Julkaisija' } },
    },
  ],
  issued: '2021-02-23',
  title: { fi: 'Julkaisun nimi', en: 'Publication title' },
  persistent_identifier: 'urn:nbn:fi:att:feedc0de',
  id: 'metax_identifier_for_this_dataset',
}

const publisherSuborganizationDataset = {
  actors: [
    { roles: ['creator'], person: { name: 'Creator' } },
    {
      roles: ['publisher'],
      organization: {
        pref_label: { en: 'Suborganization', fi: 'Joku aliorganisaatio' },
        parent: {
          pref_label: { en: 'Top organization', fi: 'Pääorganisaatio' },
        },
      },
    },
  ],
  issued: '2021-02-23',
  title: { fi: 'Julkaisun nimi', en: 'Publication title' },
  persistent_identifier: 'urn:nbn:fi:att:feedc0de',
  id: 'metax_identifier_for_this_dataset',
}

const doiDataset = {
  ...organizationDataset,
  persistent_identifier: 'doi:10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b',
}

const capitalizedUrnDataset = {
  ...organizationDataset,
  persistent_identifier: 'URN:NBN:fi:att:d00d',
}

const manyCreatorsDataset = {
  ...personDataset,
  actors: [
    ...[
      'Tyyppi Eka',
      'Tyyppi Toka',
      'Tyyppi Kolmas',
      'Tyyppi Neljäs',
      'Tyyppi Viides',
      'Tyyppi Kuudes',
      'Tyyppi Seitsemäs',
      'Tyyppi Kahdeksas',
      'Tyyppi Yhdeksäs',
      'Tyyppi Kymmenes',
      'Tyyppi Yhdestoista',
      'Tyyppi Kahdestoista',
      'Tyyppi Kolmastoista',
      'Tyyppi Neljästoista',
      'Tyyppi Viidestoista',
      'Tyyppi Kuudestoista',
      'Tyyppi Seitsemästoista',
      'Tyyppi Kahdeksastoista',
      'Tyyppi Yhdeksästoista',
      'Tyyppi Kahdeskymmenes',
      'Tyyppi Kahdeskymmenesensimmäinen',
      'Tyyppi Kahdeskymmenestoinen',
    ].map(name => ({
      roles: ['creator'],
      person: {
        name,
      },
    })),
    { roles: ['publisher'], organization: { pref_label: { en: 'Publisher' } } },
  ],
}

const firstVersionDataset = {
  ...organizationDataset,
  dataset_versions: [
    { id: 'metax_identifier_for_second', state: 'published' },
    { id: organizationDataset.id, state: 'published' },
  ],
}

const secondVersionDataset = {
  ...organizationDataset,
  dataset_versions: [
    { id: organizationDataset.id, state: 'published' },
    { id: 'metax_identifier_for_first', state: 'published' },
  ],
}

beforeEach(() => {
  stores.Locale.setLang('en')
})

describe('Citation styles', () => {
  describe('APA', () => {
    const c = dataset => {
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      return cite.apa
    }

    it('should render citation for dataset by a person', () => {
      c(personDataset).should.eq(
        'Von Sukunimi, E., & Henkilö, T. (2021). Publication title. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      c(organizationDataset).should.eq(
        'Top organization. (2021). Publication title. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use URL also for capitalized URN:NBN:fi dataset', () => {
      c(capitalizedUrnDataset).should.eq(
        'Top organization. (2021). Publication title. Publisher. http://urn.fi/urn:nbn:fi:att:d00d'
      )
    })

    it('should use URL for DOI dataset', () => {
      c(doiDataset).should.eq(
        'Top organization. (2021). Publication title. Publisher. https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      c(firstVersionDataset).should.eq(
        'Top organization. (2021). Publication title (Version 1). Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      c(secondVersionDataset).should.eq(
        'Top organization. (2021). Publication title (Version 2). Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      stores.Locale.setLang('fi')
      c(organizationDataset).should.eq(
        'Pääorganisaatio. (2021). Julkaisun nimi. Julkaisija. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use ... for more than 20 creators', () => {
      c(manyCreatorsDataset).should.eq(
        'Eka, T., Toka, T., Kolmas, T., Neljäs, T., Viides, T., Kuudes, T., Seitsemäs, T., ' +
          'Kahdeksas, T., Yhdeksäs, T., Kymmenes, T., Yhdestoista, T., Kahdestoista, T., Kolmastoista, T., ' +
          'Neljästoista, T., Viidestoista, T., Kuudestoista, T., Seitsemästoista, T., Kahdeksastoista, T., Yhdeksästoista, T., . . . Kahdeskymmenestoinen, T. ' +
          '(2021). Publication title. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset published by a suborganization', () => {
      c(publisherSuborganizationDataset).should.eq(
        'Creator. (2021). Publication title. Top organization, Suborganization. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })
  })

  describe('Chicago', () => {
    const c = dataset => {
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      return cite.chicago
    }

    it('should render citation for dataset by a person', () => {
      c(personDataset).should.eq(
        'Von Sukunimi, Etunimi, and Toinen Henkilö. 2021. ”Publication title”. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      c(organizationDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use URL also for capitalized URN:NBN:fi dataset', () => {
      c(capitalizedUrnDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Publisher. http://urn.fi/urn:nbn:fi:att:d00d'
      )
    })

    it('should use URL for DOI dataset', () => {
      c(doiDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Publisher. https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      c(firstVersionDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Version 1. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      c(secondVersionDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Version 2. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      stores.Locale.setLang('fi')
      c(organizationDataset).should.eq(
        'Pääorganisaatio. 2021. ”Julkaisun nimi”. Julkaisija. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use et al for more than 10 creators', () => {
      c(manyCreatorsDataset).should.eq(
        'Eka, Tyyppi, Tyyppi Toka, Tyyppi Kolmas, Tyyppi Neljäs, Tyyppi Viides, Tyyppi Kuudes, Tyyppi Seitsemäs, et al. 2021. ”Publication title”. Publisher. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset published by a suborganization', () => {
      c(publisherSuborganizationDataset).should.eq(
        'Creator. 2021. ”Publication title”. Top organization, Suborganization. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })
  })

  describe('MLA', () => {
    const c = dataset => {
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      return cite.mla
    }

    it('should render citation for dataset by a person', () => {
      c(personDataset).should.eq(
        'Von Sukunimi, Etunimi, and Toinen Henkilö. ”Publication title”. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      c(organizationDataset).should.eq(
        'Top organization. ”Publication title”. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use URL also for capitalized URN:NBN:fi dataset', () => {
      c(capitalizedUrnDataset).should.eq(
        'Top organization. ”Publication title”. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:d00d'
      )
    })

    it('should use URL for DOI dataset', () => {
      c(doiDataset).should.eq(
        'Top organization. ”Publication title”. Publisher, 2021. https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      c(firstVersionDataset).should.eq(
        'Top organization. ”Publication title”. Version 1. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      c(secondVersionDataset).should.eq(
        'Top organization. ”Publication title”. Version 2. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      stores.Locale.setLang('fi')
      c(organizationDataset).should.eq(
        'Pääorganisaatio. ”Julkaisun nimi”. Julkaisija, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use et al for more than 3 creators', () => {
      c(manyCreatorsDataset).should.eq(
        'Eka, Tyyppi, et al. ”Publication title”. Publisher, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset published by a suborganization', () => {
      c(publisherSuborganizationDataset).should.eq(
        'Creator. ”Publication title”. Top organization, Suborganization, 2021. http://urn.fi/urn:nbn:fi:att:feedc0de'
      )
    })
  })
  describe('BibTex', () => {
    const c = dataset => {
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      return cite.bibtex
    }

    it('should render citation for dataset by a person', () => {
      c(personDataset).should.eq(
        '@misc{urn:nbn:fi:att:feedc0de,\nauthor = {von Sukunimi, Etunimi and Henkilö, Toinen},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })

    it('should render citation for dataset by an organization', () => {
      c(organizationDataset).should.eq(
        '@misc{urn:nbn:fi:att:feedc0de,\nauthor = {Top organization},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })

    it('should use URL also for capitalized URN:NBN:fi dataset', () => {
      c(capitalizedUrnDataset).should.eq(
        '@misc{urn:nbn:fi:att:d00d,\nauthor = {Top organization},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:d00d}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })

    it('should use URL for DOI dataset', () => {
      c(doiDataset).should.eq(
        '@misc{10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b,\nauthor = {Top organization},\ntitle = {Publication title},\nhowpublished = {\\url{https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })

    it('should use Finnish titles', () => {
      stores.Locale.setLang('fi')
      c(organizationDataset).should.eq(
        '@misc{urn:nbn:fi:att:feedc0de,\nauthor = {Pääorganisaatio},\ntitle = {Julkaisun nimi},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Julkaisija}\n}'
      )
    })

    it('should use and others for more than 10 creators', () => {
      c(manyCreatorsDataset).should.eq(
        '@misc{urn:nbn:fi:att:feedc0de,\nauthor = {Eka, Tyyppi and Toka, Tyyppi and Kolmas, Tyyppi and Neljäs, Tyyppi and Viides, Tyyppi and Kuudes, Tyyppi and Seitsemäs, Tyyppi and Kahdeksas, Tyyppi and Yhdeksäs, Tyyppi and Kymmenes, Tyyppi and others},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })

    it('should render citation for dataset published by a suborganization', () => {
      c(publisherSuborganizationDataset).should.eq(
        '@misc{urn:nbn:fi:att:feedc0de,\nauthor = {Creator},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Top organization, Suborganization}\n}'
      )
    })

    it('should render citation for draft dataset', () => {
      c(draftDataset).should.eq(
        '@misc{draft,\nauthor = {von Sukunimi, Etunimi and Henkilö, Toinen},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}'
      )
    })
  })
})

describe('Utils', () => {
  describe('getNameInitials', () => {
    it('should leave single-word name unchanged', () => {
      getNameInitials('Pentti').should.eq('Pentti')
    })

    it('should use initials for first names', () => {
      getNameInitials('Mauri Antero Numminen').should.eq('Numminen, M. A.')
    })

    it('should ignore whitespace around name', () => {
      getNameInitials('   Mauri Antero Numminen   ').should.eq('Numminen, M. A.')
    })

    it('should leave multi-part last name unchanged', () => {
      getNameInitials('Johannes Diderik van der Waals').should.eq('van der Waals, J. D.')
    })

    it('should format hyphenated last name correctly', () => {
      getNameInitials('Diego J. Rivera-Gutierrez').should.eq('Rivera-Gutierrez, D. J.')
    })

    it('should put roman numeral suffix at end', () => {
      getNameInitials('Herbert M. Turner III').should.eq('Turner, H. M., III')
    })

    it('should put Jr. suffix at end', () => {
      getNameInitials('Robert John Downey Jr.').should.eq('Downey, R. J., Jr.')
    })

    it('should preserve St. in surname', () => {
      getNameInitials('Ashley M. St. John').should.eq('St. John, A. M.')
    })
  })

  describe('getLastnameFirst', () => {
    it('should leave single-word name unchanged', () => {
      getLastnameFirst('Pentti').should.eq('Pentti')
    })

    it('should use initials for first names', () => {
      getLastnameFirst('Mauri Antero Numminen').should.eq('Numminen, Mauri Antero')
    })

    it('should leave multi-part last name unchanged', () => {
      getLastnameFirst('Johannes Diderik van der Waals').should.eq(
        'van der Waals, Johannes Diderik'
      )
    })

    it('should format hyphenated last name correctly', () => {
      getLastnameFirst('Diego J. Rivera-Gutierrez').should.eq('Rivera-Gutierrez, Diego J.')
    })

    it('should put roman numeral suffix at end', () => {
      getLastnameFirst('Herbert M. Turner III').should.eq('Turner, Herbert M., III')
    })

    it('should put Jr. suffix at end', () => {
      getLastnameFirst('Robert John Downey Jr.').should.eq('Downey, Robert John, Jr.')
    })

    it('should preserve St. in surname', () => {
      getLastnameFirst('Ashley M. St. John').should.eq('St. John, Ashley M.')
    })
  })

  describe('getNameParts', () => {
    it('should preserve St. in surname', () => {
      getNameParts('Ashley M. St. John').should.eql({
        first: ['Ashley', 'M.'],
        last: ['St.', 'John'],
        suffixes: [],
      })
    })

    it('should ignore extra spaces in name', () => {
      getNameParts('    Name    With   Extra     Spaces ').should.eql({
        first: ['Name', 'With', 'Extra'],
        last: ['Spaces'],
        suffixes: [],
      })
    })
  })

  describe('getVersion', () => {
    const getTranslation = v => v.en
    it('returns correct version', () => {
      const dataset = {
        id: 1,
        dataset_versions: [1, 3, 5].map(id => ({ id, state: 'published' })),
      }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getVersion(stores.Etsin.EtsinDataset, getTranslation)).toEqual('Version 3')
    })

    it('returns undefined if dataset has no version set', () => {
      const dataset = { id: 1 }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getVersion(stores.Etsin.EtsinDataset, getTranslation)).toEqual(undefined)
    })

    it('returns undefined if dataset is not in version set', () => {
      const dataset = { id: 1, dataset_versions: [] }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getVersion(stores.Etsin.EtsinDataset, getTranslation)).toEqual(undefined)
    })
  })

  describe('getIdentifier', () => {
    it('returns preferred id', () => {
      const dataset = {
        persistent_identifier: 'xyz',
      }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getIdentifier(stores.Etsin.EtsinDataset)).toEqual('xyz')
    })

    it('returns undefined for draft', () => {
      const dataset = {
        persistent_identifier: 'xyz',
        state: 'draft',
      }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getIdentifier(stores.Etsin.EtsinDataset)).toEqual(undefined)
    })

    it('returns preferred id of published original', () => {
      const dataset = {
        persistent_identifier: 'draft-id',
        draft_of: { persistent_identifier: 'published-id' },
      }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getIdentifier(stores.Etsin.EtsinDataset)).toEqual('published-id')
    })

    it('returns doi url', () => {
      const dataset = {
        persistent_identifier: 'doi:xyz',
      }
      stores.Etsin.EtsinDataset.set('dataset', dataset)
      expect(getIdentifier(stores.Etsin.EtsinDataset)).toEqual('https://doi.org/xyz')
    })
  })
})

describe('CitationBuilder', () => {
  it('ignores empty parts', () => {
    const citation = new CitationBuilder({
      sep: '.',
      parts: [
        {
          sep: '!',
          parts: ['hello', 'world'],
        },
        {
          sep: '?',
        },
      ],
    })
    citation.get().should.eql('Hello! world')
  })
})
