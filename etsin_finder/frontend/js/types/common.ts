import type { FeatureCollection } from 'geojson'

export type MultiLanguageString = { [lang: string]: string }

export interface ReferenceData {
  pref_label: MultiLanguageString
  url: string
}

export interface SpatialObject {
  geolocations?: FeatureCollection
  reference: ReferenceData
  wkt?: string[]
}
