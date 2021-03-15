import 'chai/register-should'

import Locale from '../../js/stores/view/locale'
import Cite from '../../js/components/dataset/citation/cite'
import { getNameInitials, getLastnameFirst } from '../../js/components/dataset/citation/cite/utils'
import { should } from 'chai'

const cite = new Cite(Locale.getValueTranslation)

const emptyDataset = {
  research_dataset: {}
}

const personDataset = {
  research_dataset: {
    creator: [{ name: 'Etunimi von Sukunimi' }, { name: 'Toinen Henkilö' }],
    publisher: { name: { en: 'Publisher' } },
    issued: '2021-02-23',
    title: { fi: 'Julkaisun nimi', en: 'Publication title' },
    preferred_identifier: 'urn:nbn:fi:att:feedc0de'
  },
  identifier: 'metax_identifier_for_this_dataset',
}

const organizationDataset = {
  research_dataset: {
    creator: [{
      name: { en: 'Some suborganization', fi: 'Joku aliorganisaatio' },
      '@type': 'Organization',
      'is_part_of': { name: { en: 'Top organization', fi: 'Pääorganisaatio' }, '@type': 'Organization' }
    }],
    publisher: { name: { en: 'Publisher', fi: 'Julkaisija' } },
    issued: '2021-02-23',
    title: { fi: 'Julkaisun nimi', en: 'Publication title' },
    preferred_identifier: 'urn:nbn:fi:att:feedc0de',
  },
  identifier: 'metax_identifier_for_this_dataset',
}

const doiDataset = {
  research_dataset: {
    ...organizationDataset.research_dataset,
    preferred_identifier: 'doi:10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
  }
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
  }
}

const firstVersionDataset = {
  ...organizationDataset,
  dataset_version_set: [{ identifier: organizationDataset.identifier }, { identifier: "metax_identifier_for_first" }]
}

const secondVersionDataset = {
  ...organizationDataset,
  dataset_version_set: [{ identifier: "metax_identifier_for_first" }, { identifier: organizationDataset.identifier }]
}

beforeEach(() => {
  Locale.setLang('en', false)
})

describe('Citation styles', () => {
  describe('APA', () => {
    it('should handle empty dataset', () => {
      cite.apa(emptyDataset).should.eq('')
    })

    it('should render citation for dataset by a person', () => {
      cite.apa(personDataset).should.eq(
        'Von Sukunimi, E., & Henkilö, T. (2021). Publication title. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      cite.apa(organizationDataset).should.eq(
        'Top organization. (2021). Publication title. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use URL for DOI dataset', () => {
      cite.apa(doiDataset).should.eq(
        'Top organization. (2021). Publication title. Publisher. https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      cite.apa(firstVersionDataset).should.eq(
        'Top organization. (2021). Publication title (Version 1). Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      cite.apa(secondVersionDataset).should.eq(
        'Top organization. (2021). Publication title (Version 2). Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      Locale.setLang('fi', true)
      cite.apa(organizationDataset).should.eq(
        'Pääorganisaatio. (2021). Julkaisun nimi. Julkaisija. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use ... for more than 20 creators', () => {
      cite.apa(manyCreatorsDataset).should.eq(
        'Eka, T., Toka, T., Kolmas, T., Neljäs, T., Viides, T., Kuudes, T., Seitsemäs, T., ' +
        'Kahdeksas, T., Yhdeksäs, T., Kymmenes, T., Yhdestoista, T., Kahdestoista, T., Kolmastoista, T., ' +
        'Neljästoista, T., Viidestoista, T., Kuudestoista, T., Seitsemästoista, T., Kahdeksastoista, T., Yhdeksästoista, T., . . . Kahdeskymmenestoinen, T. ' +
        '(2021). Publication title. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })
  })

  describe('Chicago', () => {
    it('should handle empty dataset', () => {
      cite.chicago(emptyDataset).should.eq('')
    })

    it('should render citation for dataset by a person', () => {
      cite.chicago(personDataset).should.eq(
        'Von Sukunimi, Etunimi, and Toinen Henkilö. 2021. ”Publication title”. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      cite.chicago(organizationDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use URL for DOI dataset', () => {
      cite.chicago(doiDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Publisher. https://doi.org/10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      cite.chicago(firstVersionDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Version 1. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      cite.chicago(secondVersionDataset).should.eq(
        'Top organization. 2021. ”Publication title”. Version 2. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      Locale.setLang('fi', true)
      cite.chicago(organizationDataset).should.eq(
        'Pääorganisaatio. 2021. ”Julkaisun nimi”. Julkaisija. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use et al for more than 10 creators', () => {
      cite.chicago(manyCreatorsDataset).should.eq(
        'Eka, Tyyppi, Tyyppi Toka, Tyyppi Kolmas, Tyyppi Neljäs, Tyyppi Viides, Tyyppi Kuudes, Tyyppi Seitsemäs, et al. 2021. ”Publication title”. Publisher. urn:nbn:fi:att:feedc0de'
      )
    })
  })

  describe('MLA', () => {
    it('should handle empty dataset', () => {
      cite.mla(emptyDataset).should.eq('')
    })

    it('should render citation for dataset by a person', () => {
      cite.mla(personDataset).should.eq(
        'Von Sukunimi, Etunimi, and Toinen Henkilö. ”Publication title”. Publisher, 2021. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for dataset by an organization', () => {
      cite.mla(organizationDataset).should.eq(
        'Top organization. ”Publication title”. Publisher, 2021. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use DOI identifier for DOI dataset', () => {
      cite.mla(doiDataset).should.eq(
        'Top organization. ”Publication title”. Publisher, 2021. doi:10.234567/c4fef00f-1234-5678-9abcde-133753c19b7b'
      )
    })

    it('should render citation for first version of dataset', () => {
      cite.mla(firstVersionDataset).should.eq(
        'Top organization. ”Publication title”. Version 1. Publisher, 2021. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should render citation for second version of dataset', () => {
      cite.mla(secondVersionDataset).should.eq(
        'Top organization. ”Publication title”. Version 2. Publisher, 2021. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use Finnish titles', () => {
      Locale.setLang('fi', true)
      cite.mla(organizationDataset).should.eq(
        'Pääorganisaatio. ”Julkaisun nimi”. Julkaisija, 2021. urn:nbn:fi:att:feedc0de'
      )
    })

    it('should use et al for more than 3 creators', () => {
      cite.mla(manyCreatorsDataset).should.eq(
        'Eka, Tyyppi, et al. ”Publication title”. Publisher, 2021. urn:nbn:fi:att:feedc0de'
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
      getLastnameFirst('Johannes Diderik van der Waals').should.eq('van der Waals, Johannes Diderik')
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
})
