import Map from '../../../js/stores/view/map'

const data = {
  wkt_point: {
    as_wkt: ['POINT (30 10)'],
  },

  wkt_linestring: {
    as_wkt: ['LINESTRING (70 10, 10 30, 40 40)'],
  },

  wkt_polygon: {
    as_wkt: ['POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))'],
  },

  wkt_polygonInPolygon: {
    as_wkt: ['POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))'],
  },

  wkt_multipoint: {
    as_wkt: ['MULTIPOINT ((10 40), (40 30), (20 20), (30 10))'],
  },

  wkt_multipoint2: {
    as_wkt: ['MULTIPOINT (10 40, 40 30, 20 20, 30 10)'],
  },

  wkt_multilinestring: {
    as_wkt: ['MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))'],
  },

  wkt_multipolygon: {
    as_wkt: ['MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))'],
  },

  wkt_multipolygon2: {
    as_wkt: [
      'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 100)))',
    ],
  },
}

describe('Map functions', () => {
  describe('makeGeometry', () => {
    describe('from a wkt string', () => {
      describe('wkt point', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_point.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('Point')
            expect(geometry[0].coordinates).toEqual([30, 10])
            expect(geometry[0].bounds).toEqual([
              [10, 30],
              [10, 30],
            ])
            done()
          })
        })
      })
      describe('wkt linestring', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_linestring.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('LineString')
            expect(geometry[0].coordinates).toEqual([
              [70, 10],
              [10, 30],
              [40, 40],
            ])
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [40, 70],
            ])
            done()
          })
        })
      })
      describe('wkt polygon', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_polygon.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('Polygon')
            expect(geometry[0].coordinates).toEqual([
              [
                [30, 10],
                [40, 40],
                [20, 40],
                [10, 20],
                [30, 10],
              ],
            ])
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [40, 40],
            ])
            done()
          })
        })
      })
      describe('wkt polygon inside polygon', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_polygonInPolygon.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('Polygon')
            expect(geometry[0].coordinates).toEqual([
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
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [45, 45],
            ])
            done()
          })
        })
      })
      describe('wkt multipoint', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_multipoint.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('MultiPoint')
            expect(geometry[0].coordinates).toEqual([
              [10, 40],
              [40, 30],
              [20, 20],
              [30, 10],
            ])
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [40, 40],
            ])
            done()
          })
        })
      })
      describe('wkt multipoint2', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_multipoint2.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('MultiPoint')
            expect(geometry[0].coordinates).toEqual([
              [10, 40],
              [40, 30],
              [20, 20],
              [30, 10],
            ])
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [40, 40],
            ])
            done()
          })
        })
      })
      describe('wkt multilinestring', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_multilinestring.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('MultiLineString')
            expect(geometry[0].coordinates).toEqual([
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
            expect(geometry[0].bounds).toEqual([
              [10, 10],
              [40, 40],
            ])
            done()
          })
        })
      })
      describe('wkt multipolygon', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_multipolygon.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('MultiPolygon')
            expect(geometry[0].coordinates).toEqual([
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
            expect(geometry[0].bounds).toEqual([
              [5, 5],
              [40, 45],
            ])
            done()
          })
        })
      })
      describe('wkt multipolygon2', () => {
        it('geoJSON with type, coordinates and coordinates in lat,lng', done => {
          Map.makeGeometry(data.wkt_multipolygon2.as_wkt).then(geometry => {
            expect(geometry[0].type).toEqual('MultiPolygon')
            expect(geometry[0].coordinates).toEqual([
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
            expect(geometry[0].bounds).toEqual([
              [5, 10],
              [100, 45],
            ])
            done()
          })
        })
      })
    })
  })
})
