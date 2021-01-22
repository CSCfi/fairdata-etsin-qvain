import React from 'react'
import { shallow } from 'enzyme'
import { FormatChanger } from '../../../js/components/dataset/formatChanger'

const theme = {
  color: {
    primary: "#007FAD",
    white: "white"
  }
}
let Stores = {
  DatasetQuery: {
    results: {
      research_dataset: {
        preferred_identifier: "urn:nbn:fi:att:666"
      }
    },
    removed: false
  }
}

describe('FormatChanger', () => {
  test('state contains option for Datacite without validation when non harvested dataset', () => {
    const wrapper = shallow(<FormatChanger idn="urn-not-harvested" theme={theme} Stores={Stores} />)
    expect(wrapper.instance().state.formats).toContainEqual({value: "fairdata_datacite"})
    expect(wrapper.instance().state.formats.length).toBe(2)
  })
  test('state contains option for Datacite when doi', () => {
    Stores.DatasetQuery.results.research_dataset.preferred_identifier = "doi:10.23729/666"

    const wrapper = shallow(<FormatChanger idn="doi" theme={theme} Stores={Stores} />)
    expect(wrapper.instance().state.formats).toContainEqual({value: "datacite"})
    expect(wrapper.instance().state.formats.length).toBe(2)
  })
  test('state contains option for Metax JSON only when harvested', () => {
    Stores.DatasetQuery.results.research_dataset.preferred_identifier = "urn:nbn:fi:lb-666"

    const wrapper = shallow(<FormatChanger idn="urn-harvested" theme={theme} Stores={Stores} />)
    expect(wrapper.instance().state.formats).toContainEqual({value: "metax"})
    expect(wrapper.instance().state.formats.length).toBe(1)
  })
})
