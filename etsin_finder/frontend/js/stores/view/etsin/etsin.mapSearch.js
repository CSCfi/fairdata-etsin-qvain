import { makeObservable, action, observable, computed, toJS } from 'mobx'
import AbortClient from '@/utils/AbortClient'

class EtsinMapSearch {
  constructor() {
    makeObservable(this)
    this.client = new AbortClient()
  }

  @observable layers = null

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

  @action search = () => {
    console.log(toJS(this.layers))
  }
}

export default EtsinMapSearch
