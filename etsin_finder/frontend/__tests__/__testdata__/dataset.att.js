const dataset = {
  "id": 1929,
  "identifier": "162e04c5-857b-477c-a452-cd063ee3c44d",
  "data_catalog": {
    "id": 10,
    "identifier": "urn:nbn:fi:att:data-catalog-att"
  },
  "deprecated": false,
  "metadata_provider_org": "test.csc.fi",
  "metadata_provider_user": "teppo",
  "research_dataset": {
    "theme": [
      {
        "in_scheme": "http://www.yso.fi/onto/koko/",
        "identifier": "http://www.yso.fi/onto/koko/p40393",
        "pref_label": {
          "fi": "makkaranvalmistus",
          "und": "makkaranvalmistus"
        }
      },
      {
        "in_scheme": "http://www.yso.fi/onto/koko/",
        "identifier": "http://www.yso.fi/onto/koko/p55252",
        "pref_label": {
          "en": "concrete steel",
          "fi": "betoniter\u00e4s",
          "sv": "armeringsj\u00e4rn",
          "und": "betoniter\u00e4s"
        }
      }
    ],
    "title": {
      "en": "English Title",
      "fi": "Finnish Title"
    },
    "issued": "2021-01-28",
    "creator": [
      {
        "name": "Human Person",
        "@type": "Person",
        "email": "email@example.com",
        "member_of": {
          "name": {
            "en": "Unseen University"
          },
          "@type": "Organization"
        },
        "identifier": "https://orcid.org/person"
      }
    ],
    "curator": [
      {
        "name": "Human Person",
        "@type": "Person",
        "email": "email@example.com",
        "member_of": {
          "name": {
            "en": "Unseen University"
          },
          "@type": "Organization"
        },
        "identifier": "https://orcid.org/person"
      }
    ],
    "keyword": [
      "first keyword",
      "second",
      "third"
    ],
    "spatial": [
      {
        "as_wkt": [
          "POINT(24.14585 67.60502)"
        ],
        "place_uri": {
          "in_scheme": "http://www.yso.fi/onto/yso/places",
          "identifier": "http://www.yso.fi/onto/yso/p109778",
          "pref_label": {
            "en": "\u00c4k\u00e4slompolo",
            "fi": "\u00c4k\u00e4slompolo (Kolari)",
            "sv": "\u00c4k\u00e4slompolo (Kolari)",
            "und": "\u00c4k\u00e4slompolo (Kolari)"
          }
        },
        "geographic_name": "\u00c4k\u00e4slompolo"
      },
      {
        "as_wkt": [
          "POINT(30.53247 63.30216)"
        ],
        "place_uri": {
          "in_scheme": "http://www.yso.fi/onto/yso/places",
          "identifier": "http://www.yso.fi/onto/yso/p136721",
          "pref_label": {
            "en": "Hattuvaara",
            "fi": "Hattuvaara (Lieksa)",
            "sv": "Hattuvaara (Lieksa)",
            "und": "Hattuvaara (Lieksa)"
          }
        },
        "geographic_name": "Hat danger"
      }
    ],
    "language": [
      {
        "title": {
          "en": "Inuktitut",
          "fi": "inuktitut",
          "sv": "inuktitut",
          "und": "inuktitut"
        },
        "identifier": "http://lexvo.org/id/iso639-3/iku"
      },
      {
        "title": {
          "en": "Finno-Ugric language",
          "fi": "suomalais-ugrilainen kieli",
          "sv": "finskugriskt spr\u00e5k",
          "und": "suomalais-ugrilainen kieli"
        },
        "identifier": "http://lexvo.org/id/iso639-5/fiu"
      }
    ],
    "relation": [
      {
        "entity": {
          "type": {
            "in_scheme": "http://uri.suomi.fi/codelist/fairdata/resource_type",
            "identifier": "http://uri.suomi.fi/codelist/fairdata/resource_type/code/collection",
            "pref_label": {
              "en": "Collection",
              "fi": "Kokoelma",
              "und": "Kokoelma"
            }
          },
          "title": {
            "en": "Resource in English",
            "fi": "Resurssi",
            "und": "Resurssi"
          },
          "identifier": "1234-aaaaa-tunniste",
          "description": {
            "en": "Resource Description",
            "fi": "Resurssin kuvaus",
            "und": "Resurssin kuvaus"
          }
        },
        "relation_type": {
          "identifier": "http://purl.org/spar/cito/cites",
          "pref_label": {
            "en": "Cites",
            "fi": "Viittaa",
            "und": "Viittaa"
          }
        }
      }
    ],
    "temporal": [
      {
        "end_date": "2021-01-13T00:00:00.000Z",
        "start_date": "2020-12-29T00:00:00.000Z"
      },
      {
        "end_date": "2021-02-01T00:00:00.000Z",
        "start_date": "2019-05-26T00:00:00.000Z"
      },
      {
        "end_date": "2050-03-02T00:00:00.000Z",
        "start_date": "2030-01-01T00:00:00.000Z"
      }
    ],
    "publisher": {
      "name": "Human Person",
      "@type": "Person",
      "email": "email@example.com",
      "member_of": {
        "name": {
          "en": "Unseen University"
        },
        "@type": "Organization"
      },
      "identifier": "https://orcid.org/person"
    },
    "contributor": [
      {
        "name": "Human Person",
        "@type": "Person",
        "email": "email@example.com",
        "member_of": {
          "name": {
            "en": "Unseen University"
          },
          "@type": "Organization"
        },
        "identifier": "https://orcid.org/person"
      },
      {
        "name": {
          "en": "Aalto University",
          "fi": "Aalto yliopisto",
          "sv": "Aalto universitetet",
          "und": "Aalto yliopisto"
        },
        "@type": "Organization",
        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076"
      }
    ],
    "description": {
      "en": "English Description",
      "fi": "Finnish Description"
    },
    "is_output_of": [
      {
        "name": {
          "en": "Project",
          "fi": "Projekti"
        },
        "identifier": "project-identifier",
        "funder_type": {
          "in_scheme": "http://uri.suomi.fi/codelist/fairdata/funder_type",
          "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/eu-esr",
          "pref_label": {
            "en": "EU European Social Fund ESR",
            "fi": "EU Euroopan sosiaalirahasto ESR",
            "und": "EU Euroopan sosiaalirahasto ESR"
          }
        },
        "has_funding_agency": [
          {
            "name": {
              "en": "Aalto University",
              "fi": "Aalto yliopisto",
              "sv": "Aalto universitetet",
              "und": "Aalto yliopisto"
            },
            "@type": "Organization",
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
            "contributor_type": [
              {
                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/contributor_type",
                "definition": {
                  "en": "Definition of a concept",
                  "fi": "Konseptin m\u00e4\u00e4ritelm\u00e4"
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Researcher",
                "pref_label": {
                  "en": "Researcher",
                  "fi": "Tutkija",
                  "sv": "Forskare",
                  "und": "Tutkija"
                }
              }
            ]
          }
        ],
        "source_organization": [
          {
            "name": {
              "en": "Aalto University",
              "fi": "Aalto yliopisto",
              "sv": "Aalto universitetet",
              "und": "Aalto yliopisto"
            },
            "@type": "Organization",
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076"
          }
        ],
        "has_funder_identifier": "project-funding-identifier"
      }
    ],
    "access_rights": {
      "license": [
        {
          "title": {
            "en": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "fi": "Creative Commons Nime\u00e4 4.0 Kansainv\u00e4linen (CC BY 4.0)",
            "und": "Creative Commons Nime\u00e4 4.0 Kansainv\u00e4linen (CC BY 4.0)"
          },
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
        },
        {
          "title": {
            "en": "Creative Commons Attribution 1.0 Generic (CC BY 1.0)",
            "fi": "Creative Commons Nime\u00e4 1.0 Yleinen (CC BY 1.0)",
            "und": "Creative Commons Nime\u00e4 1.0 Yleinen (CC BY 1.0)"
          },
          "license": "https://creativecommons.org/licenses/by/1.0/",
          "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-1.0"
        }
      ],
      "access_type": {
        "in_scheme": "http://uri.suomi.fi/codelist/fairdata/access_type",
        "identifier": "http://uri.suomi.fi/codelist/fairdata/access_type/code/login",
        "pref_label": {
          "en": "Requires login in Fairdata service",
          "fi": "Vaatii kirjautumisen Fairdata-palvelussa",
          "und": "Vaatii kirjautumisen Fairdata-palvelussa"
        }
      },
      "restriction_grounds": [
        {
          "in_scheme": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds",
          "identifier": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright",
          "pref_label": {
            "en": "Restricted access due to copyright",
            "fi": "Saatavuutta rajoitettu tekij\u00e4oikeuden perusteella",
            "sv": "Begr\u00e4nsad \u00e5tkomst p\u00e5 grund av upphovsr\u00e4tt",
            "und": "Saatavuutta rajoitettu tekij\u00e4oikeuden perusteella"
          }
        }
      ]
    },
    "rights_holder": [
      {
        "name": "Human Person",
        "@type": "Person",
        "email": "email@example.com",
        "member_of": {
          "name": {
            "en": "Unseen University"
          },
          "@type": "Organization"
        },
        "identifier": "https://orcid.org/person"
      }
    ],
    "infrastructure": [
      {
        "in_scheme": "https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures",
        "identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072527",
        "pref_label": {
          "en": "Bioeconomy Infrastructure",
          "fi": "Huippuallianssi kest\u00e4v\u00e4\u00e4n biomassan jalostukseen",
          "und": "Huippuallianssi kest\u00e4v\u00e4\u00e4n biomassan jalostukseen"
        }
      },
      {
        "in_scheme": "https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures",
        "identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072528",
        "pref_label": {
          "en": "Cherenkov Telescope Array",
          "fi": "Cherenkov teleskooppij\u00e4rjestelm\u00e4",
          "und": "Cherenkov teleskooppij\u00e4rjestelm\u00e4"
        }
      }
    ],
    "field_of_science": [
      {
        "in_scheme": "http://www.yso.fi/onto/okm-tieteenala/conceptscheme",
        "identifier": "http://www.yso.fi/onto/okm-tieteenala/ta111",
        "pref_label": {
          "en": "Mathematics",
          "fi": "Matematiikka",
          "sv": "Matematik",
          "und": "Matematiikka"
        }
      },
      {
        "in_scheme": "http://www.yso.fi/onto/okm-tieteenala/conceptscheme",
        "identifier": "http://www.yso.fi/onto/okm-tieteenala/ta114",
        "pref_label": {
          "en": "Physical sciences",
          "fi": "Fysiikka",
          "sv": "Fysik",
          "und": "Fysiikka"
        }
      },
      {
        "in_scheme": "http://www.yso.fi/onto/okm-tieteenala/conceptscheme",
        "identifier": "http://www.yso.fi/onto/okm-tieteenala/ta113",
        "pref_label": {
          "en": "Computer and information sciences",
          "fi": "Tietojenk\u00e4sittely ja informaatiotieteet",
          "sv": "Data- och informationsvetenskap",
          "und": "Tietojenk\u00e4sittely ja informaatiotieteet"
        }
      }
    ],
    "other_identifier": [
      {
        "notation": "https://doi.org/identifier"
      },
      {
        "notation": "https://doi.org/another_identifier"
      }
    ],
    "remote_resources": [
      {
        "title": "Remote resource",
        "access_url": {
          "identifier": "https://access.url"
        },
        "download_url": {
          "identifier": "https://download.url"
        },
        "use_category": {
          "in_scheme": "http://uri.suomi.fi/codelist/fairdata/use_category",
          "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/configuration",
          "pref_label": {
            "en": "Configuration files",
            "fi": "Konfiguraatiotiedosto",
            "und": "Konfiguraatiotiedosto"
          }
        }
      }
    ],
    "preferred_identifier": "draft:162e04c5-857b-477c-a452-cd063ee3c44d",
    "metadata_version_identifier": "2037942d-a9d1-44d8-bd6c-818a0278db83"
  },
  "preservation_state": 0,
  "state": "draft",
  "use_doi_for_published": false,
  "cumulative_state": 0,
  "api_meta": {
    "version": 2
  },
  "date_modified": "2021-01-28T10:26:12+02:00",
  "date_created": "2021-01-28T10:06:32+02:00",
  "service_modified": "qvain-light",
  "service_created": "qvain-light",
  "removed": false
}

export default dataset