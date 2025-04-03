export const spatial_ref_unioninkatu = {
  url: 'http://www.yso.fi/onto/yso/p189359',
  pref_label: {
    en: 'Unioninkatu',
    fi: 'Unioninkatu (Helsinki)',
    sv: 'Unionsgatan (Helsingfors)',
  },
  in_scheme: 'http://www.yso.fi/onto/yso/places',
  as_wkt: 'POINT(24.14585 67.60502)',
}

export const spatial_ref_tapiola = {
  url: 'http://www.yso.fi/onto/yso/p105747',
  pref_label: { en: 'Tapiola', fi: 'Tapiola (Espoo)', sv: 'Hagalund (Esbo)' },
  in_scheme: 'http://www.yso.fi/onto/yso/places',
  as_wkt: 'POINT(24.80634 60.17653)',
}

export const spatial_a = {
  reference: spatial_ref_unioninkatu,
  full_address: 'Annankatu 5',
  geographic_name: 'Random Test Location',
  altitude_in_meters: null,
  id: 'c3d7beac-6724-412b-8365-9efa39d9b21b',
}

export const spatial_b = {
  reference: spatial_ref_unioninkatu,
  altitude_in_meters: null,
  full_address: 'Unioninkatu 6, Helsinki',
  geographic_name: 'Random Address in Helsinki',
  id: 'c3d7beac-6724-412b-8365-9efa39d9b21b',
}

export const spatial_c = {
  reference: spatial_ref_tapiola,
  full_address: 'Itätuulenkuja 3, Espoo',
  geographic_name: 'Another Random Address in Espoo',
  altitude_in_meters: 1337,
  id: 'c04c4768-515e-463d-a3d8-f75b2f532acc',
  custom_wkt: ['POINT(22 61)'],
}
