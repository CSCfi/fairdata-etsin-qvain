import { wktToGeoJSON } from '@terraformer/wkt'
import bbox from '@turf/bbox'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

// functions for map component
export class Map {
  constructor(Locale) {
    this.Locale = Locale
  }

  async makeGeometry(spatial) {
    if (spatial.wkt?.length > 0) {
      return this.makeGeometryFromWKT(spatial.wkt)
    }
    return this.makeGeometryFromPlace(spatial.reference.pref_label)
  }

  makeGeometryFromWKT(wkt) {
    // Make geometry from array of WKT strings. Coordinates are in (long, lat) order.
    const geometries = wkt.map(string => wktToGeoJSON(string))
    if (geometries.length === 1) {
      return geometries[0]
    } else {
      // Multiple geometries, make into collection
      return {
        type: 'GeometryCollection',
        geometries: geometries,
      }
    }
  }

  // queries place name and returns rectangle based on its bounds
  async makeGeometryFromPlace(location) {
    const provider = new OpenStreetMapProvider()
    try {
      const results = await provider.search({ query: this.Locale.getValueTranslation(location) })
      const [[minLat, minLong], [maxLat, maxLong]] = results[0].bounds
      const geometry = {
        type: 'Polygon',
        coordinates: [
          [
            [minLong, minLat],
            [maxLong, minLat],
            [maxLong, maxLat],
            [minLong, maxLat],
            [minLong, minLat],
          ],
        ],
      }
      return geometry
    } catch (err) {
      console.error(err)
    }
  }

  getLeafletBounds(geometry) {
    // Return bounds as (lat, long) points as expected by Leaflet
    const [minLong, minLat, maxLong, maxLat] = bbox(geometry)
    return [
      [minLat, minLong],
      [maxLat, maxLong],
    ]
  }
}

export default Map
