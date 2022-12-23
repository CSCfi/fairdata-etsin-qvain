import { buildStores } from '../../js/stores'
import Cite from '../../js/components/dataset/citation/cite'
import CitationBuilder from '../../js/components/dataset/citation/cite/citationBuilder'
import {
  getNameInitials,
  getLastnameFirst,
  getNameParts,
  getVersion,
  getIdentifier,
} from '../../js/components/dataset/citation/cite/utils'

const stores = buildStores()
const cite = new Cite(stores.Locale.getValueTranslation)

const emptyDataset = {
  research_dataset: {},
}

const personDataset = {
  research_dataset: {
    creator: [{ name: 'Etunimi von Sukunimi' }, { name: 'Toinen Henkilö' }],
    publisher: { name: { en: 'Publisher' } },
    issued: '2021-02-23',
    title: { fi: 'Julkaisun nimi', en: 'Publication title' },
    preferred_identifier: 'urn:nbn:fi:att:feedc0de',
  },
  identifier: 'metax_identifier_for_this_dataset',
}

const draftDataset = {
  ...personDataset,
  state: 'draft',
  identifier: undefined
}

const organizationDataset = {
  research_dataset: {
    creator: [
      {
        name: { en: 'Some suborganization', fi: 'Joku aliorganisaatio' },
        '@type': 'Organization',
        is_part_of: {
          name: { en: 'Top organization', fi: 'Pääorganisaatio' },
          '@type': 'Organization',
        },
      },
    ],
    publisher: { name: { en: 'Publisher', fi: 'Julkaisija' } },
    issued: '2021-02-23',
    title: { fi: 'Julkaisun nimi', en: 'Publication title' },
    preferred_identifier: 'urn:nbn:fi:att:feedc0de',
  },
  identifier: 'metax_identifier_for_this_dataset',
}

const publisherSuborganizationDataset = {
  research_dataset: {
    creator: [{ name: { en: 'Creator', fi: 'Creator' } }],
    publisher: {
      name: { en: 'Suborganization', fi: 'Joku aliorganisaatio' },
      '@type': 'Organization',
      is_part_of: {
        name: { en: 'Top organization', fi: 'Pääorganisaatio' },
        '@type': 'Organization',
      },
    },
    issued: '2021-02-23',
    title: { fi: 'Julkaisun nimi', en: 'Publication title' },
    preferred_identifier: 'urn:nbn:fi:att:feedc0de',
  },
  identifier: 'metax_identifier_for_this_dataset',
}

const doiDataset = {
  research_dataset: {
    ...organizationDataset.research_dataset,
    preferred_identifier: 'doi:10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b',
  },
}

const capitalizedUrnDataset = {
  research_dataset: {
    ...organizationDataset.research_dataset,
    preferred_identifier: 'URN:NBN:fi:att:d00d',
  },
}

const manyCreatorsDataset = {
  research_dataset: {
    ...personDataset.research_dataset,
    creator: [
      { name: 'Tyyppi Eka' },
      { name: 'Tyyppi Toka' },
      { name: 'Tyyppi Kolmas' },
      { name: 'Tyyppi Neljäs' },
      { name: 'Tyyppi Viides' },
      { name: 'Tyyppi Kuudes' },
      { name: 'Tyyppi Seitsemäs' },
      { name: 'Tyyppi Kahdeksas' },
      { name: 'Tyyppi Yhdeksäs' },
      { name: 'Tyyppi Kymmenes' },
      { name: 'Tyyppi Yhdestoista' },
      { name: 'Tyyppi Kahdestoista' },
      { name: 'Tyyppi Kolmastoista' },
      { name: 'Tyyppi Neljästoista' },
      { name: 'Tyyppi Viidestoista' },
      { name: 'Tyyppi Kuudestoista' },
      { name: 'Tyyppi Seitsemästoista' },
      { name: 'Tyyppi Kahdeksastoista' },
      { name: 'Tyyppi Yhdeksästoista' },
      { name: 'Tyyppi Kahdeskymmenes' },
      { name: 'Tyyppi Kahdeskymmenesensimmäinen' },
      { name: 'Tyyppi Kahdeskymmenestoinen' },
    ],
  },
}

const firstVersionDataset = {
  ...organizationDataset,
  dataset_version_set: [
    { identifier: 'metax_identifier_for_second' },
    { identifier: organizationDataset.identifier },
  ],
}

const secondVersionDataset = {
  ...organizationDataset,
  dataset_version_set: [
    { identifier: organizationDataset.identifier },
    { identifier: 'metax_identifier_for_first' },
  ],
}

beforeEach(() => {
  stores.Locale.setLang('en')
})

describe('Citation styles', () => {
  describe('APA', () => {
    const c = cite.apa

    it('should handle empty dataset', () => {
      c(emptyDataset).should.eq('')
    })

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
    const c = cite.chicago

    it('should handle empty dataset', () => {
      c(emptyDataset).should.eq('')
    })

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
    const c = cite.mla

    it('should handle empty dataset', () => {
      c(emptyDataset).should.eq('')
    })

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
    const c = cite.bibtex

    it('should handle empty dataset', () => {
      c(emptyDataset).should.eq('')
    })

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
      c(draftDataset).should.eq('@misc{draft,\nauthor = {von Sukunimi, Etunimi and Henkilö, Toinen},\ntitle = {Publication title},\nhowpublished = {\\url{http://urn.fi/urn:nbn:fi:att:feedc0de}},\nmonth = {2},\nyear = {2021},\nnote = {Publisher}\n}')
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
        identifier: 1,
        dataset_version_set: [{ identifier: 1 }, { identifier: 3 }, { identifier: 5 }],
      }
      expect(getVersion(dataset, getTranslation)).toEqual('Version 3')
    })

    it('returns undefined if dataset has no version set', () => {
      const dataset = { identifier: 1 }
      expect(getVersion(dataset, getTranslation)).toEqual(undefined)
    })

    it('returns undefined if dataset is not in version set', () => {
      const dataset = { identifier: 1, dataset_version_set: [] }
      expect(getVersion(dataset, getTranslation)).toEqual(undefined)
    })
  })

  describe('getIdentifier', () => {
    it('returns preferred identifier', () => {
      const dataset = {
        research_dataset: { preferred_identifier: 'xyz' },
      }
      expect(getIdentifier(dataset)).toEqual('xyz')
    })

    it('returns unefined for draft', () => {
      const dataset = {
        research_dataset: { preferred_identifier: 'xyz' },
        state: 'draft',
      }
      expect(getIdentifier(dataset)).toEqual(undefined)
    })

    it('returns preferred identifier of published original', () => {
      const dataset = {
        research_dataset: { preferred_identifier: 'draft-id' },
        draft_of: { preferred_identifier: 'published-id' },
      }
      expect(getIdentifier(dataset)).toEqual('published-id')
    })

    it('returns doi url', () => {
      const dataset = {
        research_dataset: { preferred_identifier: 'doi:xyz' },
      }
      expect(getIdentifier(dataset)).toEqual('https://doi.org/xyz')
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
