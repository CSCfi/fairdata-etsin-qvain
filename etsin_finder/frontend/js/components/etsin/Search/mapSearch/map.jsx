import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { MapContainer, TileLayer } from 'react-leaflet'
import { observer } from 'mobx-react'

import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons'

import { useStores } from '@/stores/stores'

import Modal from '@/components/general/modal'
import Button from '@/components/general/button'
import useQuery from '../../general/useQuery'
import { useNavigate } from 'react-router'
import Translate from '@/utils/Translate'
import MapInstanceSaver from './MapInstanceSaver'
import GeoJSONLayer from './GeoJSONLayer'
import GeomanToolBar from './GeomanToolBar'
import { FilterCategory, Section } from '../filterResults/filterSection'
import MapInfoButton from './MapInfoButton'

const EtsinMap = () => {
  const {
    Etsin: {
      Search: {
        MapSearch: {
          layers,
          retrieve,
          setView,
          setLayers,
          search,
          defaultSidebarMapCenterAsArray,
          defaultSidebarMapZoom,
        },
      },
    },
  } = useStores()

  const query = useQuery()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)
  const [expandedMapInstance, setExpandedMapInstance] = useState(null)
  const [sidebarMapInstance, setSidebarMapInstance] = useState(null)
  const [isMapLayersSaved, setIsMapLayersSaved] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  // If layers have been drawn and saved on the map during initial render
  // or when the layers change, keep the facet open.
  useEffect(() => {
    if (layers) {
      setIsMapOpen(true)
    }
  }, [layers])

  // When the query changes, geolocation data is fetched (and rendered
  // on the map via the GeoJSONLayer component). The isMapLayersSaved is set
  // to true to allow the map to be centered based on the user or geolocation
  // data. If fetching fails (e.g. due to an invalid geolocation definition),
  // it is removed from the query and navigation falls back to the /dataset
  // location defined by the query.
  useEffect(() => {
    try {
      retrieve(query)
      setIsMapLayersSaved(true)
    } catch (e) {
      console.error(e)
      if (query.has('geolocation')) {
        query.delete('geolocation')
      }
      navigate(`/datasets?${query.toString()}`)
    }
  }, [query, retrieve, navigate, setIsMapLayersSaved])

  const expandMap = () => {
    saveMapLayers(sidebarMapInstance)
    setModalOpen(true)
  }

  const closeMap = () => {
    saveMapLayers(expandedMapInstance)
    setModalOpen(false)
  }

  const saveMapLayers = map => {
    setView(map.getCenter(), map.getZoom())
    setIsMapLayersSaved(true)

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

  const searchDatasets = () => {
    if (query.has('geolocation')) {
      query.delete('geolocation')
    }
    search(query)
    navigate(`/datasets?${query.toString()}`)
  }

  // TODO: Animate in the same way as FilterItems in filterSection.jsx
  return (
    <>
      <Section>
        <Translate
          component={FilterCategory}
          content="search.aggregations.geographicalArea.title"
          onClick={() => {
            setIsMapOpen(!isMapOpen)
          }}
          aria-expanded={isMapOpen}
        />
        {/* Sidebar map */}
        <MapDiv aria-hidden={!isMapOpen} className={isMapOpen ? 'open' : ''}>
          {!modalOpen && (
            <SidebarMapContainer
              center={defaultSidebarMapCenterAsArray}
              zoom={defaultSidebarMapZoom}
              aria-hidden={!isMapOpen}
              className={isMapOpen ? 'open' : ''}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <ExpandMapButton title="Expand map" onClick={() => expandMap()}>
                <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
              </ExpandMapButton>
              <MapInfoButton isMapOpen={isMapOpen} />
              <GeomanToolBar />
              <GeoJSONLayer
                isMapLayersSaved={isMapLayersSaved}
                setIsMapLayersSaved={setIsMapLayersSaved}
              />
              <MapInstanceSaver setter={setSidebarMapInstance} />
            </SidebarMapContainer>
          )}
          <Translate
            component={SearchButton}
            content="search.mapSearch.searchButton"
            onClick={() => {
              saveMapLayers(sidebarMapInstance)
              searchDatasets()
            }}
          />
        </MapDiv>
      </Section>

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
          <MapInfoButton isMapOpen={isMapOpen} />
          <GeomanToolBar />
          <GeoJSONLayer
            isMapLayersSaved={isMapLayersSaved}
            setIsMapLayersSaved={setIsMapLayersSaved}
          />
          <MapInstanceSaver setter={setExpandedMapInstance} />
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
  height: 0;
  overflow: hidden;
  &.open {
    height: auto;
    margin-bottom: 0.5em;
    padding: 1em 0 0.5em 0;
  }
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

const SearchButton = styled(Button)`
    padding: 0.3em 0.6em;
`

export default observer(EtsinMap)
