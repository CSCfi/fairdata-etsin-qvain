import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { darken } from 'polished'
import checkColor from '@/styles/styledUtils'
import styled from 'styled-components'
import Translate from '@/utils/Translate'
import withCustomProps from '@/utils/withCustomProps'
import L from 'leaflet'

function MapInfoButton({ isMapOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  // When the map facet is closed, close the info button popup:
  useEffect(() => {
    if (isMapOpen === false) {
      setIsOpen(false)
    }
  }, [isMapOpen, setIsOpen])

  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  // Disable map movement on click when the info button is pressed:
  const disableClickPropagation = el => {
    if (el) {
      L.DomEvent.disableClickPropagation(el)
    }
  }

  return (
    <Wrapper
      onClick={toggleIsOpen}
      ref={el => {
        disableClickPropagation(el)
      }}
    >
      <IconButton type="button" title="Map drawing instructions">
        <FontAwesomeIcon icon={faInfoCircle} />
      </IconButton>

      {isOpen && (
        <Popup>
          <Translate component="span" content="search.mapSearch.tooltip" />
        </Popup>
      )}
    </Wrapper>
  )
}

MapInfoButton.propTypes = {
  isMapOpen: PropTypes.bool.isRequired,
}

const Wrapper = styled.div`
  position: absolute;
  bottom: 24px;
  right: 10px;
  z-index: 800;
`

const IconButton = withCustomProps(styled.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 3px;
  background-color: white;
  border-radius: 4px;
  border: 2px solid rgba(0,0,0,0.2);
  cursor: pointer;
  svg {
      color: ${p => p.theme.color.primary};
      height: 100%;
      &:hover {
          color: ${props => darken(0.1, props.color ? checkColor(props.color) : props.theme.color.primary)}
      }
  }
  &:hover {
      background: #f4f4f4;
  }
`

const Popup = withCustomProps(styled.div)`
  position: absolute;
  text-align: left;
  bottom: 3em;
  right: 0;
  min-width: 200px;
  background: white;
  padding: 0.7em;
  box-shadow: 0 2px 4px 1px rgba(0,0,0,0.3);
  border-radius: 4px;
  > span {
      color: ${p => p.theme.color.darker};
  }
`

export default observer(MapInfoButton)
