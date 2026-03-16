import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'

import { useStores } from '@/stores/stores'

import Modal from '@/components/general/modal'
import Button from '@/components/general/button'

const EtsinMap = () => {
    const {
        Etsin: {
            Search: {
                MapSearch: { layers, bounds, setLayers, search },
            },
        },
    } = useStores()

    const [modalOpen, setModalOpen] = useState(false)
    const [expandedMapInstance, setExpandedMapInstance] = useState(null)
    const [sidebarMapInstance, setSidebarMapInstance] = useState(null)

    const MapInstanceSaver = ({ setter }) => {
        const map = useMap()
        useEffect(() => {
            map.whenReady(() => {
                setter(map)
            })
        }, [map, setter])
    }

    const expandMap = () => {
        saveMapLayers(sidebarMapInstance)
        setModalOpen(true)
    }

    const closeMap = () => {
        saveMapLayers(expandedMapInstance)
        setModalOpen(false)
    }

    const GeoJSONLayer = () => {
        // draws features from stores to map

        const map = useMap()

        useEffect(() => {
            if (map && layers) {
                const geoJsonLayers = L.geoJSON(toJS(layers))
                const group = L.layerGroup([geoJsonLayers])
                group.addTo(map)
                if (bounds) {
                    map.fitBounds(bounds)
                }

                return () => {
                    map.removeLayer(group)
                }
            }
        }, [map])
    }

    const saveMapLayers = map => {
        let features = []

        const drawnLayers = map.pm.getGeomanLayers(true)

        drawnLayers.eachLayer(layer => {
            const geoJsonLayer = layer.toGeoJSON()
            if (geoJsonLayer) {
                if (geoJsonLayer.type === 'FeatureCollection') {
                    features.push(...geoJsonLayer.features)
                } else {
                    features.push(geoJsonLayer)
                }
            }
            map.removeLayer(layer)
        })

        const layerData = {
            type: 'FeatureCollection',
            features,
        }

        if (features.length > 0) {
            setLayers(layerData)
        } else {
            setLayers(null)
        }
    }

    const GeomanToolBar = () => {
        const map = useMap()

        map.whenReady(() => {
            // replace icons with working ones
            delete L.Icon.Default.prototype._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: markerIcon2x,
                iconUrl: markerIcon,
                shadowUrl: markerShadow,
            })

            // add the toolbar
            map.pm.addControls({
                position: 'topleft',
                drawCircle: false,
                drawCircleMarker: false,
                drawPolyline: false,
                drawText: false,
                oneBlock: false,
                customControls: false,
            })
        })
    }

    return (
        <>
            {/* Sidebar map */}
            <MapDiv>
                {!modalOpen && (
                    <SidebarMapContainer center={[65, 27]} zoom={4}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <ExpandMapButton title="Expand map" onClick={() => expandMap()}>
                            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                        </ExpandMapButton>
                        <GeomanToolBar />
                        <GeoJSONLayer />
                        <MapInstanceSaver mapInstance={sidebarMapInstance} setter={setSidebarMapInstance} />
                    </SidebarMapContainer>
                )}
                {/* todo: add translation */}
                <Button
                    onClick={() => {
                        saveMapLayers(sidebarMapInstance)
                        search()
                    }}
                >
                    Search by Location
                </Button>
            </MapDiv>

            {/* Modal for large map */}
            <Modal
                isOpen={modalOpen}
                onRequestClose={() => closeMap()}
                contentLabel={'Expanded Map'}
                customStyles={{
                    content: {
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        padding: '0',
                    },
                }}
            >
                <LargeMapContainer center={[65, 27]} zoom={5}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <GeomanToolBar />
                    <GeoJSONLayer />
                    <MapInstanceSaver mapInstance={expandedMapInstance} setter={setExpandedMapInstance} />
                </LargeMapContainer>
            </Modal>
        </>
    )
}

const SidebarMapContainer = styled(MapContainer)`
  height: 350px;
  margin-bottom: 0.5em;
`

const LargeMapContainer = styled(MapContainer)`
  height: 80vh;
  width: 80vw;
  margin-top: 0;
`

const MapDiv = styled.div`
  text-align: center;
  margin-bottom: 0.5em;
`

const ExpandMapButton = styled.a`
  position: absolute;
  top: 10px;
  right: 10px;
  height: 30px;
  width: 30px;
  padding: 3px;
  text-align: center;
  box-sizing: border-box;
  background-clip: padding-box;
  background-color: white;
  border-radius: 4px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 800;

  &:hover {
    background-color: #f4f4f4;
  }

  & .svg-inline--fa {
    color: #5b5b5b;
    height: 100%;
  }
`

export default observer(EtsinMap)