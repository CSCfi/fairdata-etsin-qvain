import { OpenStreetMapProvider } from 'leaflet-geosearch'
import { buildStores } from '@/stores'

vi.mock('leaflet-geosearch', async () => {
  return {
    OpenStreetMapProvider: vi.fn(),
  }
})

const stores = buildStores()
const Map = stores.Map

const data = {
  wkt_point: {
    wkt: ['POINT (30 10)'],
  },

  wkt_linestring: {
    wkt: ['LINESTRING (70 10, 10 30, 40 40)'],
  },

  wkt_polygon: {
    wkt: ['POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))'],
  },

  wkt_point_and_polygon: {
    // point not overlapping wkt_polygon
    wkt: ['POINT (-30 -10)', 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))'],
  },

  wkt_polygonInPolygon: {
    wkt: ['POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))'],
  },

  wkt_multipoint: {
    wkt: ['MULTIPOINT ((10 40), (40 30), (20 20), (30 10))'],
  },

  wkt_multipoint2: {
    wkt: ['MULTIPOINT (10 40, 40 30, 20 20, 30 10)'],
  },

  wkt_multilinestring: {
    wkt: ['MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))'],
  },

  wkt_multipolygon: {
    wkt: ['MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))'],
  },

  wkt_multipolygon2: {
    wkt: [
      'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 100)))',
    ],
  },
  location_name: {
    reference: {
      pref_label: {
        fi: 'Luumäki',
      },
    },
  },
}

const location_query_result = [
  {
    x: '27.5693101',
    y: '60.9225204',
    label: 'Luumäki, Lappeenranta sub-region, South Karelia, Mainland Finland, Finland',
    bounds: [
      [60.7953333, 27.1211303],
      [61.1064861, 27.9332148],
    ],
    raw: {
      // Other raw data omitted
      licence: 'Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright',
    },
  },
]

describe('makeGeometry from wkt string', () => {
  describe('wkt point', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_point)
      expect(geometry.type).toEqual('Point')
      expect(geometry.coordinates).toEqual([30, 10])
    })
  })

  describe('wkt linestring', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_linestring)
      expect(geometry.type).toEqual('LineString')
      expect(geometry.coordinates).toEqual([
        [70, 10],
        [10, 30],
        [40, 40],
      ])
    })
  })

  describe('wkt polygon', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_polygon)
      expect(geometry.type).toEqual('Polygon')
      expect(geometry.coordinates).toEqual([
        [
          [30, 10],
          [40, 40],
          [20, 40],
          [10, 20],
          [30, 10],
        ],
      ])
    })
  })

  describe('wkt polygon inside polygon', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_polygonInPolygon)
      expect(geometry.type).toEqual('Polygon')
      expect(geometry.coordinates).toEqual([
        [
          [35, 10],
          [45, 45],
          [15, 40],
          [10, 20],
          [35, 10],
        ],
        [
          [20, 30],
          [35, 35],
          [30, 20],
          [20, 30],
        ],
      ])
    })
  })

  describe('wkt multipoint', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_multipoint)
      expect(geometry.type).toEqual('MultiPoint')
      expect(geometry.coordinates).toEqual([
        [10, 40],
        [40, 30],
        [20, 20],
        [30, 10],
      ])
    })
  })

  describe('wkt multipoint2', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_multipoint2)
      expect(geometry.type).toEqual('MultiPoint')
      expect(geometry.coordinates).toEqual([
        [10, 40],
        [40, 30],
        [20, 20],
        [30, 10],
      ])
    })
  })

  describe('wkt multilinestring', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_multilinestring)
      expect(geometry.type).toEqual('MultiLineString')
      expect(geometry.coordinates).toEqual([
        [
          [10, 10],
          [20, 20],
          [10, 40],
        ],
        [
          [40, 40],
          [30, 30],
          [40, 20],
          [30, 10],
        ],
      ])
    })
  })

  describe('wkt multipolygon', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_multipolygon)
      expect(geometry.type).toEqual('MultiPolygon')
      expect(geometry.coordinates).toEqual([
        [
          [
            [30, 20],
            [45, 40],
            [10, 40],
            [30, 20],
          ],
        ],
        [
          [
            [15, 5],
            [40, 10],
            [10, 20],
            [5, 10],
            [15, 5],
          ],
        ],
      ])
    })
  })

  describe('wkt multipolygon2', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_multipolygon2)
      expect(geometry.type).toEqual('MultiPolygon')
      expect(geometry.coordinates).toEqual([
        [
          [
            [40, 40],
            [20, 45],
            [45, 30],
            [40, 40],
          ],
        ],
        [
          [
            [20, 35],
            [10, 30],
            [10, 10],
            [30, 5],
            [45, 20],
            [20, 35],
          ],
          [
            [30, 20],
            [20, 15],
            [20, 25],
            [30, 100],
          ],
        ],
      ])
    })
  })

  describe('wkt point and polygon', () => {
    it('geoJSON with type, coordinates and coordinates in lng,lat', async () => {
      const geometry = await Map.makeGeometry(data.wkt_point_and_polygon)
      expect(geometry.type).toEqual('GeometryCollection')
      expect(geometry.geometries).toEqual([
        { type: 'Point', coordinates: [-30, -10] },
        {
          type: 'Polygon',
          coordinates: [
            [
              [30, 10],
              [40, 40],
              [20, 40],
              [10, 20],
              [30, 10],
            ],
          ],
        },
      ])
    })
  })
})

describe('makeGeometry from location name', () => {
  test('Location without WKT should query by name', async () => {
    const searchMock = vi.fn(async () => location_query_result)
    class MockProvider {
      search = searchMock
    }
    OpenStreetMapProvider.mockImplementation(MockProvider)
    const geometry = await Map.makeGeometry(data.location_name)

    expect(searchMock).toHaveBeenCalledWith({ query: 'Luumäki' })

    // should be a rectangle following bounds counterclockwise
    expect(geometry.type).toBe('Polygon')
    expect(geometry.coordinates).toEqual([
      [
        [27.1211303, 60.7953333],
        [27.9332148, 60.7953333],
        [27.9332148, 61.1064861],
        [27.1211303, 61.1064861],
        [27.1211303, 60.7953333],
      ],
    ])
  })
})

describe('getLeafletBounds', async () => {
  // Coordinates for Leaflet bounds should reversed (lat, lng)
  test('bounds from WKT point', async () => {
    const bounds = Map.getLeafletBounds(await Map.makeGeometry(data.wkt_point))
    expect(bounds).toEqual([
      [10, 30],
      [10, 30],
    ])
  })

  test('bounds from WKT multipolygon', async () => {
    const bounds = Map.getLeafletBounds(await Map.makeGeometry(data.wkt_multipolygon2))
    expect(bounds).toEqual([
      [5, 10],
      [100, 45],
    ])
  })

  test('bounds from WKT point and polygon', async () => {
    const bounds = Map.getLeafletBounds(await Map.makeGeometry(data.wkt_point_and_polygon))
    expect(bounds).toEqual([
      [-10, -30],
      [40, 40],
    ])
  })
})
