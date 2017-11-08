import React from 'react';
import ReactDOM from 'react-dom'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import {undecorated as Dataset} from '../js/dataset'
import Stores from '../js/stores'

const data = {
  "id": 1,
  "data_catalog": {
      "id": 1,
      "catalog_json": {
          "title": {
              "en": "Test data catalog name",
              "fi": "Testidatakatalogin nimi"
          },
          "issued": "2014-02-27T08:19:58Z",
          "homepage": [
              {
                  "title": {
                      "en": "Test website",
                      "fi": "Testi-verkkopalvelu"
                  },
                  "identifier": "http://testing.com"
              },
              {
                  "title": {
                      "en": "Another website",
                      "fi": "Toinen verkkopalvelu"
                  },
                  "identifier": "http://www.testing.fi"
              }
          ],
          "language": [
              {
                  "identifier": "http://lexvo.org/id/iso639-3/fin"
              },
              {
                  "identifier": "http://lexvo.org/id/iso639-3/eng"
              }
          ],
          "modified": "2014-01-17T08:19:58Z",
          "harvested": false,
          "publisher": {
              "name": {
                  "en": "Data catalog publisher organization",
                  "fi": "Datakatalogin julkaisijaorganisaatio"
              },
              "homepage": [
                  {
                      "title": {
                          "en": "Publisher organization website",
                          "fi": "Julkaisijaorganisaation kotisivu"
                      },
                      "identifier": "http://www.publisher.fi/"
                  }
              ],
              "identifier": "http://isni.org/isni/0000000405129137"
          },
          "identifier": "pid:urn:catalog1",
          "access_rights": {
              "type": [
                  {
                      "identifier": "http://purl.org/att/es/reference_data/access_type/access_type_open_access",
                      "pref_label": {
                          "en": "Open",
                          "fi": "Avoin"
                      }
                  }
              ],
              "license": [
                  {
                      "title": {
                          "en": "CC BY 4.0",
                          "fi": "CC BY 4.0"
                      },
                      "identifier": "https://creativecommons.org/licenses/by/4.0/"
                  }
              ],
              "description": [
                  {
                      "fi": "Käyttöehtojen kuvaus"
                  }
              ],
              "has_rights_related_agent": [
                  {
                      "name": {
                          "en": "A rights related organization",
                          "fi": "Oikeuksiin liittyvä organisaatio"
                      },
                      "identifier": "org_id"
                  },
                  {
                      "name": {
                          "en": "Org in ref data",
                          "fi": "Org referenssidatassa"
                      },
                      "email": "wahatever@madeupdomain.com",
                      "telephone": [
                          "+12353495823424"
                      ],
                      "identifier": "http://purl.org/att/es/organization_data/organization/organization_10076"
                  }
              ]
          },
          "field_of_science": [
              {
                  "identifier": "http://www.yso.fi/onto/okm-tieteenala/ta1172",
                  "pref_label": {
                      "en": "Environmental sciences",
                      "fi": "Ympäristötiede"
                  }
              }
          ],
          "research_dataset_schema": "att"
      },
      "catalog_record_group_edit": "default-record-edit-group",
      "catalog_record_group_create": "default-record-create-group",
      "modified_by_api": "2017-05-15T13:07:22.559656",
      "created_by_api": "2017-05-15T13:07:22.559656"
  },
  "research_dataset": {
      "files": [
          {
              "type": {
                  "identifier": "http://purl.org/att/es/reference_data/file_type/file_type_text",
                  "pref_label": {
                      "en": "Text",
                      "fi": "Teksti",
                      "und": "Teksti"
                  }
              },
              "title": "File metadata title 0",
              "identifier": "pid:urn:1"
          },
          {
              "type": {
                  "identifier": "http://purl.org/att/es/reference_data/file_type/file_type_text",
                  "pref_label": {
                      "en": "Text",
                      "fi": "Teksti",
                      "und": "Teksti"
                  }
              },
              "title": "File metadata title 1",
              "identifier": "pid:urn:2"
          }
      ],
      "title": {
          "en": "Wonderful Title"
      },
      "creator": [
          {
              "name": "Teppo Testaaja",
              "@type": "Person",
              "member_of": {
                  "name": {
                      "fi": "Mysteeriorganisaatio"
                  },
                  "@type": "Organization"
              }
          }
      ],
      "curator": [
          {
              "name": {
                  "en": "Org in ref data",
                  "fi": "Organisaatio"
              },
              "@type": "Organization",
              "identifier": "10076-E700"
          }
      ],
      "language": [
          {
              "identifier": "http://lexvo.org/id/iso639-3/eng"
          }
      ],
      "modified": "2014-01-17T08:19:58Z",
      "description": [
          {
              "en": "A descriptive description describing the contents of this dataset. Must be descriptive."
          }
      ],
      "version_notes": [
          "This version contains changes to x and y."
      ],
      "urn_identifier": "pid:urn:cr1",
      "total_byte_size": 300,
      "preferred_identifier": "pid:urn:preferred:dataset1"
  },
  "preservation_state": 0,
  "dataset_group_edit": "default-dataset-edit-group",
  "modified_by_api": "2017-05-23T13:07:22.559656",
  "created_by_api": "2017-05-23T13:07:22.559656"
}
describe('mount Dataset', () => {
  let mock = '';
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  
  afterEach(() => {
    mock.reset()
  })
  
  afterAll(() => {
    mock.restore()
  })

  it('renders without crashing', () => {
    shallow(<Dataset match={{params: {identifier: 1}}} dataid={1} />)
  })
  describe('With data', () => {
    mock.onGet('https://metax-test.csc.fi/rest/datasets/1.json').reply(200, data);
    const MyDataset = shallow(<Dataset match={{params: {identifier: 1}}} dataid={1} />)
    describe('Get data', () => {
      it('should get with page id', (done) => {
        expect(MyDataset.html()).toEqual('something')
      })
    })
  })
})