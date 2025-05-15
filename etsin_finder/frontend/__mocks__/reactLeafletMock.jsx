import React from 'react'

// react-leaflet is ESM-only, mock it instead of trying to get it work with jest
module.exports = {
  MapContainer: () => <div>MapContainer</div>,
  Popup: () => <div>Popup</div>,
  TileLayer: () => <div>TileLayer</div>,
  GeoJSON: () => <div>GeoJSON</div>,
  Marker: () => <div>Marker</div>,
  Rectangle: () => <div>Rectangle</div>,
}
