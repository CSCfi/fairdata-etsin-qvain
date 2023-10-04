"""Frontend test data for qvain tests."""
from etsin_finder.utils.constants import DATA_CATALOG_IDENTIFIERS, ACCESS_TYPES

original_project_list = [
    {
        "details": {
            "title": {"en": "qwe", "fi": "qweqwe"},
            "identifier": "test",
            "fundingIdentifier": "tetets",
            "funderType": {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes"
            },
        },
        "organizations": [
            {
                "@type": "Organization",
                "name": {
                    "en": "Yliopistopalvelut",
                    "fi": "Yliopistopalvelut",
                    "und": "Yliopistopalvelut",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                "is_part_of": {
                    "@type": "Organization",
                    "name": {
                        "en": "University of Helsinki",
                        "fi": "Helsingin yliopisto",
                        "und": "Helsingin yliopisto",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                },
            },
        ],
        "fundingAgencies": [
            {
                "@type": "Organization",
                "name": {
                    "en": "School services, ARTS",
                    "fi": "School services, ARTS",
                    "und": "School services, ARTS",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                "is_part_of": {
                    "@type": "Organization",
                    "name": {
                        "en": "Aalto University",
                        "fi": "Aalto yliopisto",
                        "und": "Aalto yliopisto",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                },
                "contributor_type": [
                    {
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                        "pref_label": {"en": "Other", "fi": "Muu", "und": "Muu"},
                    }
                ],
            }
        ],
    }
]

expected_project_list = [
    {
        "name": {"en": "qwe", "fi": "qweqwe"},
        "identifier": "test",
        "has_funder_identifier": "tetets",
        "funder_type": {
            "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes"
        },
        "source_organization": [
            {
                "@type": "Organization",
                "name": {
                    "en": "Yliopistopalvelut",
                    "fi": "Yliopistopalvelut",
                    "und": "Yliopistopalvelut",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                "is_part_of": {
                    "name": {
                        "en": "University of Helsinki",
                        "fi": "Helsingin yliopisto",
                        "und": "Helsingin yliopisto",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                    "@type": "Organization",
                },
            }
        ],
        "has_funding_agency": [
            {
                "name": {
                    "en": "School services, ARTS",
                    "fi": "School services, ARTS",
                    "und": "School services, ARTS",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                "is_part_of": {
                    "name": {
                        "en": "Aalto University",
                        "fi": "Aalto yliopisto",
                        "und": "Aalto yliopisto",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                    "@type": "Organization",
                },
                "@type": "Organization",
                "contributor_type": [
                    {
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                        "pref_label": {
                            "en": "Other",
                            "fi": "Muu",
                            "und": "Muu",
                        },
                    }
                ],
            }
        ],
    }
]

original_open_rights = {
    "license": [
        {
            "name": {"en": "standard open license"},
            "identifier": "standard open license identifier",
        },
    ],
    "accessType": {
        "url": ACCESS_TYPES.get("open"),
    },
}

expected_open_rights = {
    "license": [
        {"identifier": "standard open license identifier"},
    ],
    "access_type": {
        "identifier": ACCESS_TYPES.get("open"),
    },
}

original_embargo_rights = {
    "license": [
        {
            "name": {"en": "standard embargo license"},
            "identifier": "standard embargo license identifier",
        }
    ],
    "accessType": {
        "url": ACCESS_TYPES.get("embargo"),
    },
    "embargoDate": "till tomorrow",
    "restrictionGrounds": "for your eyes only",
}

expected_embargo_rights = {
    "license": [{"identifier": "standard embargo license identifier"}],
    "access_type": {
        "identifier": ACCESS_TYPES.get("embargo"),
    },
    "restriction_grounds": [{"identifier": "for your eyes only"}],
    "available": "till tomorrow",
}

original_custom_rights = {
    "license": [
        {
            "name": {"en": "Other (URL): custom license"},
            "identifier": "custom license identifier",
        },
    ],
    "accessType": {
        "url": ACCESS_TYPES.get("permit"),
    },
    "restrictionGrounds": "for your eyes only",
}

expected_custom_rights = {
    "license": [{"license": "custom license identifier"}],
    "access_type": {
        "identifier": ACCESS_TYPES.get("permit"),
    },
    "restriction_grounds": [{"identifier": "for your eyes only"}],
}

original_remote_resources = [
    {
        "title": "remote_resource",
        "access_url": {"identifier": "access url"},
        "download_url": {"identifier": "download url"},
        "use_category": {"identifier": "use category"},
    }
]

expected_remote_resources = [
    {
        "title": "remote_resource",
        "access_url": {"identifier": "access url"},
        "download_url": {"identifier": "download url"},
        "use_category": {"identifier": "use category"},
    }
]

original_complete_dataset = {
    "modified": "2022-09-22T11:53:31.990Z",
    "title": {"en": "test", "fi": ""},
    "description": {"en": "desc", "fi": ""},
    "other_identifier": [
        {"notation": "https://doin.com/some_identifier"},
        {"notation": "doi:10.23729/12345678-aaaa"},
    ],
    "keyword": ["qwe"],
    "theme": [{"identifier": "http://www.yso.fi/onto/koko/p46606"}],
    "access_rights": {
        "license": [
            {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
            }
        ],
        "access_type": {
            "identifier": "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
        },
        "restriction_grounds": [
            {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright"
            }
        ],
        "available": "2021-07-14",
    },
    "creator": [
        {
            "@type": "Person",
            "name": "Teppo Testaaja",
            "email": "teppo.testaaja@hotmail.com",
            "identifier": "https://doi.com/teppotestaa1337",
            "member_of": {
                "@type": "Organization",
                "name": {"en": "testiosasto"},
                "email": "testiosasto@suomenpankki.fi",
                "is_part_of": {
                    "@type": "Organization",
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                },
            },
        },
        {
            "@type": "Organization",
            "name": {
                "en": "Suomen Pankki",
                "fi": "Suomen Pankki",
                "sv": "Finlands bank",
                "und": "Suomen Pankki",
            },
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
        },
    ],
    "publisher": {
        "@type": "Person",
        "name": "Teppo Testaaja",
        "email": "teppo.testaaja@hotmail.com",
        "identifier": "https://doi.com/teppotestaa1337",
        "member_of": {
            "@type": "Organization",
            "name": {"en": "testiosasto"},
            "email": "testiosasto@suomenpankki.fi",
            "is_part_of": {
                "@type": "Organization",
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
            },
        },
    },
    "curator": [
        {
            "@type": "Organization",
            "name": {
                "en": "Suomen Pankki",
                "fi": "Suomen Pankki",
                "sv": "Finlands bank",
                "und": "Suomen Pankki",
            },
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
        },
    ],
    "rights_holder": [
        {
            "@type": "Organization",
            "name": {
                "en": "Suomen Pankki",
                "fi": "Suomen Pankki",
                "sv": "Finlands bank",
                "und": "Suomen Pankki",
            },
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
        },
    ],
    "contributor": [
        {
            "@type": "Organization",
            "name": {
                "en": "Suomen Pankki",
                "fi": "Suomen Pankki",
                "sv": "Finlands bank",
                "und": "Suomen Pankki",
            },
            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
        },
    ],
    "infrastructure": [
        {
            "identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072515",
        }
    ],
    "remote_resources": [
        {
            "id": 0,
            "title": "qew",
            "access_url": "",
            "download_url": "",
            "use_category": {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/publication",
            },
        }
    ],
    "data_catalog": "urn:nbn:fi:att:data-catalog-att",
    "cumulative_state": 0,
    "use_doi": False,
    "is_output_of": [
        {
            "name": {"en": "qwe", "fi": "qweqwe"},
            "identifier": "test",
            "has_funder_identifier": "tetets",
            "funder_type": {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes"
            },
            "source_organization": [
                {
                    "@type": "Organization",
                    "name": {
                        "en": "Yliopistopalvelut",
                        "fi": "Yliopistopalvelut",
                        "und": "Yliopistopalvelut",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                    "is_part_of": {
                        "@type": "Organization",
                        "name": {
                            "en": "University of Helsinki",
                            "fi": "Helsingin yliopisto",
                            "sv": "Helsingfors universitet",
                            "und": "Helsingin yliopisto",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                    },
                },
            ],
            "has_funding_agency": [
                {
                    "@type": "Organization",
                    "name": {
                        "en": "School services, ARTS",
                        "fi": "School services, ARTS",
                        "und": "School services, ARTS",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                    "is_part_of": {
                        "@type": "Organization",
                        "name": {
                            "en": "Aalto University",
                            "sv": "Aalto universitetet",
                            "fi": "Aalto yliopisto",
                            "und": "Aalto yliopisto",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                    },
                    "contributor_type": [
                        {
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                            "pref_label": {
                                "en": "Other",
                                "fi": "Muu",
                                "sv": "Annan",
                                "und": "Muu",
                            },
                            "definition": {"en": "other", "fi": "oerhhrh"},
                            "in_scheme": "http://uri.suomi.fi/codelist/fairdata/contributor_type",
                        }
                    ],
                }
            ],
        }
    ],
    "spatial": [
        {"geographic_name": "qwe", "alt": "2309", "as_wkt": [], "place_uri": {}}
    ],
    "temporal": [
        {"end_date": "2021-06-08T00:00:00.000Z"},
        {"start_date": "2021-06-07T00:00:00.000Z"},
        {
            "start_date": "2021-06-01T00:00:00.000Z",
            "end_date": "2021-06-16T00:00:00.000Z",
        },
    ],
    "relation": [
        {
            "entity": {
                "title": {"en": "qwe", "und": "qwe", "fi": ""},
                "description": {"fi": "", "en": "", "und": ""},
                "identifier": "",
            },
            "relation_type": {"identifier": "http://www.w3.org/ns/adms#next"},
        }
    ],
    "provenance": [
        {
            "title": {"en": "we", "und": "we", "fi": ""},
            "description": {"fi": "", "en": "", "und": ""},
            "outcome_description": {"fi": "", "en": "", "und": ""},
            "event_outcome": {},
            "used_entity": [],
            "was_associated_with": [],
            "lifecycle_event": {},
        }
    ],
    "field_of_science": [{"identifier": "http://www.yso.fi/onto/okm-tieteenala/ta112"}],
    "language": [{"identifier": "http://lexvo.org/id/iso639-3/udm"}],
    "issued": "2021-06-23",
    "original": {
        "id": 2182,
        "identifier": "d986fc86-adfc-4227-8944-df1460d61e7a",
        "data_catalog": {"id": 10, "identifier": "urn:nbn:fi:att:data-catalog-att"},
        "deprecated": False,
        "metadata_owner_org": "csc.fi",
        "metadata_provider_org": "csc.fi",
        "metadata_provider_user": "fd_teppo3",
        "research_dataset": {
            "theme": [
                {
                    "in_scheme": "http://www.yso.fi/onto/koko/",
                    "identifier": "http://www.yso.fi/onto/koko/p46606",
                    "pref_label": {
                        "en": "bark humus",
                        "fi": "kuorihumus",
                        "und": "kuorihumus",
                    },
                }
            ],
            "title": {"en": "test"},
            "issued": "2021-06-23",
            "creator": [
                {
                    "name": "Teppo Testaaja",
                    "@type": "Person",
                    "email": "teppo.testaaja@hotmail.com",
                    "member_of": {
                        "name": {"en": "testiosasto"},
                        "@type": "Organization",
                        "email": "testiosasto@suomenpankki.fi",
                        "is_part_of": {
                            "name": {
                                "en": "Suomen Pankki",
                                "fi": "Suomen Pankki",
                                "sv": "Finlands bank",
                                "und": "Suomen Pankki",
                            },
                            "@type": "Organization",
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                        },
                    },
                    "identifier": "https://doi.com/teppotestaa1337",
                },
                {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "@type": "Organization",
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                },
            ],
            "curator": [
                {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "@type": "Organization",
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                }
            ],
            "keyword": ["qwe"],
            "spatial": [{"alt": "2309", "geographic_name": "qwe"}],
            "language": [
                {
                    "title": {
                        "en": "Udmurt",
                        "fi": "udmurtti",
                        "sv": "udmurtiska",
                        "und": "udmurtti",
                    },
                    "identifier": "http://lexvo.org/id/iso639-3/udm",
                }
            ],
            "relation": [
                {
                    "entity": {"title": {"en": "qwe", "und": "qwe"}},
                    "relation_type": {
                        "identifier": "http://www.w3.org/ns/adms#next",
                        "pref_label": {
                            "en": "Has next version",
                            "fi": "Seuraava versio",
                            "und": "Seuraava versio",
                        },
                    },
                }
            ],
            "temporal": [
                {"end_date": "2021-06-08T00:00:00.000Z"},
                {"start_date": "2021-06-07T00:00:00.000Z"},
                {
                    "end_date": "2021-06-16T00:00:00.000Z",
                    "start_date": "2021-06-01T00:00:00.000Z",
                },
            ],
            "publisher": {
                "name": "Teppo Testaaja",
                "@type": "Person",
                "email": "teppo.testaaja@hotmail.com",
                "member_of": {
                    "name": {"en": "testiosasto"},
                    "@type": "Organization",
                    "email": "testiosasto@suomenpankki.fi",
                    "is_part_of": {
                        "name": {
                            "en": "Suomen Pankki",
                            "fi": "Suomen Pankki",
                            "sv": "Finlands bank",
                            "und": "Suomen Pankki",
                        },
                        "@type": "Organization",
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                    },
                },
                "identifier": "https://doi.com/teppotestaa1337",
            },
            "provenance": [{"title": {"en": "we", "und": "we"}}],
            "contributor": [
                {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "@type": "Organization",
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                }
            ],
            "description": {"en": "desc"},
            "is_output_of": [
                {
                    "name": {"en": "qwe", "fi": "qweqwe"},
                    "identifier": "test",
                    "funder_type": {
                        "in_scheme": "http://uri.suomi.fi/codelist/fairdata/funder_type",
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes",
                        "pref_label": {"en": "Tekes", "fi": "Tekes", "und": "Tekes"},
                    },
                    "has_funding_agency": [
                        {
                            "name": {
                                "en": "School services, ARTS",
                                "fi": "School services, ARTS",
                                "und": "School services, ARTS",
                            },
                            "@type": "Organization",
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                            "is_part_of": {
                                "name": {
                                    "en": "Aalto University",
                                    "fi": "Aalto yliopisto",
                                    "sv": "Aalto universitetet",
                                    "und": "Aalto yliopisto",
                                },
                                "@type": "Organization",
                                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                            },
                            "contributor_type": [
                                {
                                    "in_scheme": "http://uri.suomi.fi/codelist/fairdata/contributor_type",
                                    "definition": {"en": "other", "fi": "oerhhrh"},
                                    "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                                    "pref_label": {
                                        "en": "Other",
                                        "fi": "Muu",
                                        "sv": "Annan",
                                        "und": "Muu",
                                    },
                                }
                            ],
                        }
                    ],
                    "source_organization": [
                        {
                            "name": {
                                "fi": "Yliopistopalvelut",
                                "und": "Yliopistopalvelut",
                            },
                            "@type": "Organization",
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                            "is_part_of": {
                                "name": {
                                    "en": "University of Helsinki",
                                    "fi": "Helsingin yliopisto",
                                    "sv": "Helsingfors universitet",
                                    "und": "Helsingin yliopisto",
                                },
                                "@type": "Organization",
                                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                            },
                        }
                    ],
                    "has_funder_identifier": "tetets",
                }
            ],
            "access_rights": {
                "license": [
                    {
                        "title": {
                            "en": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
                            "fi": "Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)",
                            "und": "Creative Commons Nimeä 4.0 Kansainvälinen (CC BY 4.0)",
                        },
                        "license": "https://creativecommons.org/licenses/by/4.0/",
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0",
                    }
                ],
                "available": "2021-07-14",
                "access_type": {
                    "in_scheme": "http://uri.suomi.fi/codelist/fairdata/access_type",
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo",
                    "pref_label": {"en": "Embargo", "fi": "Embargo", "und": "Embargo"},
                },
                "restriction_grounds": [
                    {
                        "in_scheme": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds",
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright",
                        "pref_label": {
                            "en": "Restricted access due to copyright",
                            "fi": "Saatavuutta rajoitettu tekijäoikeuden perusteella",
                            "sv": "Begränsad åtkomst på grund av upphovsrätt",
                            "und": "Saatavuutta rajoitettu tekijäoikeuden perusteella",
                        },
                    }
                ],
            },
            "rights_holder": [
                {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "@type": "Organization",
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                }
            ],
            "infrastructure": [
                {
                    "in_scheme": "https://avaa.tdata.fi/api/jsonws/tupa-portlet.Infrastructures/get-all-infrastructures",
                    "identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072515",
                    "pref_label": {
                        "en": "Biocenter Finland",
                        "fi": "Biokeskus Suomi",
                        "und": "Biokeskus Suomi",
                    },
                }
            ],
            "field_of_science": [
                {
                    "in_scheme": "http://www.yso.fi/onto/okm-tieteenala/conceptscheme",
                    "identifier": "http://www.yso.fi/onto/okm-tieteenala/ta112",
                    "pref_label": {
                        "en": "Statistics and probability",
                        "fi": "Tilastotiede",
                        "sv": "Statistik",
                        "und": "Tilastotiede",
                    },
                }
            ],
            "remote_resources": [
                {
                    "title": "qew",
                    "use_category": {
                        "in_scheme": "http://uri.suomi.fi/codelist/fairdata/use_category",
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/publication",
                        "pref_label": {
                            "en": "Publication",
                            "fi": "Julkaisu",
                            "und": "Julkaisu",
                        },
                    },
                }
            ],
            "preferred_identifier": "urn:nbn:fi:att:7fbfd248-e8af-427c-9161-b4a0f89c4109",
            "metadata_version_identifier": "77c1a25d-6ca9-4d19-b659-b3f1f38eea8d",
            "total_remote_resources_byte_size": 0,
        },
        "preservation_state": 0,
        "state": "published",
        "cumulative_state": 0,
        "access_granter": {
            "name": "fd_teppo3_first fd_teppo3_läst",
            "email": "helpdesk@csc.fi",
            "userid": "fd_teppo3",
        },
        "api_meta": {"version": 2},
        "date_modified": "2021-07-28T13:27:45+03:00",
        "date_created": "2021-06-23T09:59:58+03:00",
        "service_modified": "qvain-light",
        "service_created": "qvain-light",
        "removed": False,
    },
}

expected_complete_dataset = {
    "data_catalog": "urn:nbn:fi:att:data-catalog-att",
    "research_dataset": {
        "modified": "2022-09-22T11:53:31.990Z",
        "title": {"en": "test"},
        "description": {"en": "desc"},
        "creator": [
            {
                "@type": "Person",
                "name": "Teppo Testaaja",
                "email": "teppo.testaaja@hotmail.com",
                "identifier": "https://doi.com/teppotestaa1337",
                "member_of": {
                    "name": {"en": "testiosasto"},
                    "email": "testiosasto@suomenpankki.fi",
                    "@type": "Organization",
                    "is_part_of": {
                        "name": {
                            "en": "Suomen Pankki",
                            "fi": "Suomen Pankki",
                            "sv": "Finlands bank",
                            "und": "Suomen Pankki",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                        "@type": "Organization",
                    },
                },
            },
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            },
        ],
        "publisher": {
            "@type": "Person",
            "name": "Teppo Testaaja",
            "email": "teppo.testaaja@hotmail.com",
            "identifier": "https://doi.com/teppotestaa1337",
            "member_of": {
                "name": {"en": "testiosasto"},
                "email": "testiosasto@suomenpankki.fi",
                "@type": "Organization",
                "is_part_of": {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                    "@type": "Organization",
                },
            },
        },
        "curator": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "rights_holder": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "contributor": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "issued": "2021-06-23",
        "other_identifier": [
            {"notation": "https://doin.com/some_identifier"},
            {"notation": "doi:10.23729/12345678-aaaa"},
        ],
        "field_of_science": [
            {"identifier": "http://www.yso.fi/onto/okm-tieteenala/ta112"}
        ],
        "language": [{"identifier": "http://lexvo.org/id/iso639-3/udm"}],
        "keyword": ["qwe"],
        "theme": [{"identifier": "http://www.yso.fi/onto/koko/p46606"}],
        "access_rights": {
            "license": [
                {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                }
            ],
            "access_type": {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
            },
            "restriction_grounds": [
                {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright"
                }
            ],
            "available": "2021-07-14",
        },
        "remote_resources": [
            {
                "use_category": {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/publication"
                },
                "title": "qew",
            }
        ],
        "is_output_of": [
            {
                "name": {"en": "qwe", "fi": "qweqwe"},
                "identifier": "test",
                "has_funder_identifier": "tetets",
                "funder_type": {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes"
                },
                "source_organization": [
                    {
                        "name": {
                            "fi": "Yliopistopalvelut",
                            "en": "Yliopistopalvelut",
                            "und": "Yliopistopalvelut",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                        "is_part_of": {
                            "name": {
                                "en": "University of Helsinki",
                                "fi": "Helsingin yliopisto",
                                "sv": "Helsingfors universitet",
                                "und": "Helsingin yliopisto",
                            },
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                            "@type": "Organization",
                        },
                        "@type": "Organization",
                    }
                ],
                "has_funding_agency": [
                    {
                        "name": {
                            "en": "School services, ARTS",
                            "fi": "School services, ARTS",
                            "und": "School services, ARTS",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                        "is_part_of": {
                            "name": {
                                "en": "Aalto University",
                                "fi": "Aalto yliopisto",
                                "sv": "Aalto universitetet",
                                "und": "Aalto yliopisto",
                            },
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                            "@type": "Organization",
                        },
                        "@type": "Organization",
                        "contributor_type": [
                            {
                                "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                                "pref_label": {
                                    "en": "Other",
                                    "fi": "Muu",
                                    "sv": "Annan",
                                    "und": "Muu",
                                },
                                "definition": {"en": "other", "fi": "oerhhrh"},
                                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/contributor_type",
                            }
                        ],
                    }
                ],
            }
        ],
        "relation": [
            {
                "entity": {"title": {"en": "qwe", "und": "qwe"}},
                "relation_type": {"identifier": "http://www.w3.org/ns/adms#next"},
            }
        ],
        "provenance": [{"title": {"en": "we", "und": "we"}}],
        "infrastructure": [
            {"identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072515"}
        ],
        "spatial": [{"geographic_name": "qwe", "alt": "2309"}],
        "temporal": [
            {"end_date": "2021-06-08T00:00:00.000Z"},
            {"start_date": "2021-06-07T00:00:00.000Z"},
            {
                "start_date": "2021-06-01T00:00:00.000Z",
                "end_date": "2021-06-16T00:00:00.000Z",
            },
        ],
    },
}

expected_edited_dataset = {
    "data_catalog": "urn:nbn:fi:att:data-catalog-att",
    "research_dataset": {
        "modified": "2022-09-22T11:53:31.990Z",
        "theme": [{"identifier": "http://www.yso.fi/onto/koko/p46606"}],
        "title": {"en": "test"},
        "issued": "2021-06-23",
        "creator": [
            {
                "@type": "Person",
                "name": "Teppo Testaaja",
                "email": "teppo.testaaja@hotmail.com",
                "identifier": "https://doi.com/teppotestaa1337",
                "member_of": {
                    "name": {"en": "testiosasto"},
                    "email": "testiosasto@suomenpankki.fi",
                    "@type": "Organization",
                    "is_part_of": {
                        "name": {
                            "en": "Suomen Pankki",
                            "fi": "Suomen Pankki",
                            "sv": "Finlands bank",
                            "und": "Suomen Pankki",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                        "@type": "Organization",
                    },
                },
            },
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            },
        ],
        "curator": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "keyword": ["qwe"],
        "spatial": [{"geographic_name": "qwe", "alt": "2309"}],
        "language": [{"identifier": "http://lexvo.org/id/iso639-3/udm"}],
        "relation": [
            {
                "entity": {"title": {"en": "qwe", "und": "qwe"}},
                "relation_type": {"identifier": "http://www.w3.org/ns/adms#next"},
            }
        ],
        "temporal": [
            {"end_date": "2021-06-08T00:00:00.000Z"},
            {"start_date": "2021-06-07T00:00:00.000Z"},
            {
                "start_date": "2021-06-01T00:00:00.000Z",
                "end_date": "2021-06-16T00:00:00.000Z",
            },
        ],
        "publisher": {
            "@type": "Person",
            "name": "Teppo Testaaja",
            "email": "teppo.testaaja@hotmail.com",
            "identifier": "https://doi.com/teppotestaa1337",
            "member_of": {
                "name": {"en": "testiosasto"},
                "email": "testiosasto@suomenpankki.fi",
                "@type": "Organization",
                "is_part_of": {
                    "name": {
                        "en": "Suomen Pankki",
                        "fi": "Suomen Pankki",
                        "sv": "Finlands bank",
                        "und": "Suomen Pankki",
                    },
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                    "@type": "Organization",
                },
            },
        },
        "provenance": [{"title": {"en": "we", "und": "we"}}],
        "contributor": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "description": {"en": "desc"},
        "is_output_of": [
            {
                "name": {"en": "qwe", "fi": "qweqwe"},
                "identifier": "test",
                "has_funder_identifier": "tetets",
                "funder_type": {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/funder_type/code/tekes"
                },
                "source_organization": [
                    {
                        "name": {
                            "fi": "Yliopistopalvelut",
                            "en": "Yliopistopalvelut",
                            "und": "Yliopistopalvelut",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901-H01",
                        "is_part_of": {
                            "name": {
                                "en": "University of Helsinki",
                                "fi": "Helsingin yliopisto",
                                "sv": "Helsingfors universitet",
                                "und": "Helsingin yliopisto",
                            },
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/01901",
                            "@type": "Organization",
                        },
                        "@type": "Organization",
                    }
                ],
                "has_funding_agency": [
                    {
                        "name": {
                            "en": "School services, ARTS",
                            "fi": "School services, ARTS",
                            "und": "School services, ARTS",
                        },
                        "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076-A800",
                        "is_part_of": {
                            "name": {
                                "en": "Aalto University",
                                "fi": "Aalto yliopisto",
                                "sv": "Aalto universitetet",
                                "und": "Aalto yliopisto",
                            },
                            "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/10076",
                            "@type": "Organization",
                        },
                        "@type": "Organization",
                        "contributor_type": [
                            {
                                "identifier": "http://uri.suomi.fi/codelist/fairdata/contributor_type/code/Other",
                                "pref_label": {
                                    "en": "Other",
                                    "fi": "Muu",
                                    "sv": "Annan",
                                    "und": "Muu",
                                },
                                "definition": {"en": "other", "fi": "oerhhrh"},
                                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/contributor_type",
                            }
                        ],
                    }
                ],
            }
        ],
        "access_rights": {
            "license": [
                {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                }
            ],
            "access_type": {
                "identifier": "http://uri.suomi.fi/codelist/fairdata/access_type/code/embargo"
            },
            "restriction_grounds": [
                {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/restriction_grounds/code/copyright"
                }
            ],
            "available": "2021-07-14",
        },
        "rights_holder": [
            {
                "name": {
                    "en": "Suomen Pankki",
                    "fi": "Suomen Pankki",
                    "sv": "Finlands bank",
                    "und": "Suomen Pankki",
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/organization/code/02022481",
                "@type": "Organization",
            }
        ],
        "infrastructure": [
            {"identifier": "http://urn.fi/urn:nbn:fi:research-infras-2016072515"}
        ],
        "field_of_science": [
            {"identifier": "http://www.yso.fi/onto/okm-tieteenala/ta112"}
        ],
        "remote_resources": [
            {
                "use_category": {
                    "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/publication"
                },
                "title": "qew",
            }
        ],
        "preferred_identifier": "urn:nbn:fi:att:7fbfd248-e8af-427c-9161-b4a0f89c4109",
        "metadata_version_identifier": "77c1a25d-6ca9-4d19-b659-b3f1f38eea8d",
        "other_identifier": [
            {"notation": "https://doin.com/some_identifier"},
            {"notation": "doi:10.23729/12345678-aaaa"},
        ],
    },
    "use_doi_for_published": False,
}


datasets_partly_deleted = {
    "results": [
        {"name": "not deleted", "removed": False},
        {"name": "deleted", "removed": True},
        {"name": "not deleted", "removed": False},
    ]
}

# not official format, only projectIdentifier changed to match checks
files_and_directories = {
    "files": [
        {
            "title": "file title 6",
            "projectIdentifier": "project_x",
            "file_type": {
                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/file_type",
                "definition": {
                    "en": "A statement or formal explanation of the meaning of a concept."
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/file_type/code/video",
                "pref_label": {"en": "Video", "fi": "Video", "und": "Video"},
            },
            "identifier": "pid:urn:6",
            "description": "file description 6",
            "use_category": {
                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/use_category",
                "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/configuration",
                "pref_label": {
                    "en": "Configuration files",
                    "fi": "Konfiguraatiotiedosto",
                    "und": "Konfiguraatiotiedosto",
                },
            },
        },
        {
            "title": "file title 10",
            "projectIdentifier": "project_x",
            "file_type": {
                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/file_type",
                "definition": {
                    "en": "A statement or formal explanation of the meaning of a concept."
                },
                "identifier": "http://uri.suomi.fi/codelist/fairdata/file_type/code/software",
                "pref_label": {"en": "Software", "fi": "Sovellus", "und": "Sovellus"},
            },
            "identifier": "pid:urn:10",
            "description": "file description 10",
            "use_category": {
                "in_scheme": "http://uri.suomi.fi/codelist/fairdata/use_category",
                "identifier": "http://uri.suomi.fi/codelist/fairdata/use_category/code/publication",
                "pref_label": {
                    "en": "Publication",
                    "fi": "Julkaisu",
                    "und": "Julkaisu",
                },
            },
        },
    ],
}
