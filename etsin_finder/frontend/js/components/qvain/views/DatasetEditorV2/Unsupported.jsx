import { useState } from 'react'
import styled from 'styled-components'
import Translate from '@/utils/Translate'

import { useStores } from '../../utils/stores'

const Unsupported = () => {
  const [showDetails, setShowDetails] = useState(false)
  const {
    Qvain: { unsupported },
  } = useStores()

  if (!unsupported || unsupported.length === 0) {
    return null
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const detailsKey = showDetails ? 'qvain.unsupported.hideDetails' : 'qvain.unsupported.showDetails'

  return (
    <UnsupportedInfo>
      <Translate content="qvain.unsupported.info" component="p" />
      <Translate content={detailsKey} component={DetailsButton} onClick={toggleDetails} />
      {showDetails && (
        <FieldList>
          {unsupported
            .filter(([, value]) => value !== '')
            .map(([path, value]) => (
              <Item key={path}>
                {path}: <Value>{value}</Value>
              </Item>
            ))}
        </FieldList>
      )}
    </UnsupportedInfo>
  )
}

const FieldList = styled.ul`
  margin-top: 1rem;
`

const Item = styled.li``

const Value = styled.span`
  margin-left: 0.5em;
  word-break: break-word;
  display: inline-block;
`

const DetailsButton = styled.button.attrs({
  type: 'button',
})`
  background: none;
  color: inherit;
  border: none;
  font-weight: 700;
  border: 1px solid white;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
`

const UnsupportedInfo = styled.div`
  background-color: ${props => props.theme.color.error};
  width: 100%;
  color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 300px;
  padding: 2rem;
  margin-top: 1rem;
`

export default Unsupported
