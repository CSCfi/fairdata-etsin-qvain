import { makeObservable, action, observable, computed } from 'mobx'
import AbortClient from '@/utils/AbortClient'
import WKT from 'terraformer-wkt-parser'
import { latLng } from 'leaflet'

class EtsinMapSearch {
  constructor() {
    makeObservable(this)
    this.client = new AbortClient()
  }

  @observable layers = null // GeoJSON layer

  @observable resetLayers = false

  // The map center (an instance of the Leaflet LatLng class):
  @observable currentCenter = null

  // The map zoom level (an integer):
  @observable currentZoom = null

  @observable defaultSidebarMapCenterAsArray = [65, 27] // [lat, long]

  @observable defaultSidebarMapZoom = 4

  @computed get bounds() {
    if (!this.layers) return null

    function getCoordinates(feature) {
      const coordinates = []

      function getFeatureCoordinates(feature) {
        if (feature.type === 'Point') {
          coordinates.push(feature.coordinates)
        } else if (feature.type === 'MultiPoint' || feature.type === 'LineString') {
          coordinates.push(...feature.coordinates)
        } else if (feature.type === 'MultiLineString' || feature.type === 'Polygon') {
          feature.coordinates.forEach(line => coordinates.push(...line))
        } else if (feature.type === 'MultiPolygon') {
          feature.coordinates.forEach(polygon => {
            polygon.forEach(ring => coordinates.push(...ring))
          })
        } else if (feature.type === 'GeometryCollection') {
          feature.geometries.forEach(geometry => getFeatureCoordinates(geometry))
        }
      }

      getFeatureCoordinates(feature)
      return coordinates
    }

    let minLat = null,
      minLng = null,
      maxLat = null,
      maxLng = null

    this.layers.features.forEach(feature => {
      const coordinates = getCoordinates(feature.geometry)

      coordinates.forEach(([lng, lat]) => {
        if (!minLat || lat < minLat) minLat = lat
        if (!maxLat || lat > maxLat) maxLat = lat
        if (!minLng || lng < minLng) minLng = lng
        if (!maxLng || lng > maxLng) maxLng = lng
      })
    })

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ]
  }

  @action setLayers = layers => {
    this.layers = layers
  }

  @action setResetLayers = bool => {
    this.resetLayers = bool
  }

  @action setView = (center, zoom) => {
    this.currentCenter = center
    this.currentZoom = zoom
  }

  @action applyDefaultView = () => {
    this.currentCenter = latLng(...this.defaultSidebarMapCenterAsArray)
    this.currentZoom = this.defaultSidebarMapZoom
  }

  @action search = query => {
    if (this.layers?.features.length > 0) {
      this.layers.features.forEach(feature => {
        /* WKT.convert method transforms a GeoJSON feature object into a 
        WKT-formatted string. For example 
        { coordintes: [long, lat], type: "Point" } becomes 'POINT (long lat)'. 
        Using the replace method on the first occurrence of the space 
        character, the result is then converted to "POINT(long lat)". */
        const queryParamValue = WKT.convert(feature.geometry).replace(' ', '')
        query.append('geolocation', queryParamValue)
      })
    }
  }

  @action retrieve = query => {
    const geolocation = query.getAll('geolocation')

    if (geolocation.length > 0) {
      const features = geolocation.map(feature => {
        /* WKT.parse method parses a WKT-formatted string into 
        a GeoJSON feature object. For example 'POINT (long lat)' 
        becomes { coordinates: [long, lat], type: 'Point' }.
        Before parsing, a space is added before the first 
        parenthesis to ensure the string is in valid WKT format. */
        return { geometry: WKT.parse(feature.replace('(', ' (')), type: 'Feature' }
      })

      this.setLayers({
        type: 'FeatureCollection',
        features: features,
      })
    } else {
      /* If the geolocation query parameter is not present, the layers are 
      set to null and the (sidebar) map view is centered to the default 
      values. */
      this.setLayers(null)
      this.applyDefaultView()
    }
  }
}

export default EtsinMapSearch
