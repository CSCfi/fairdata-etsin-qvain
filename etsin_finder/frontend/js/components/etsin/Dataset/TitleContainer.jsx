import styled from 'styled-components'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'

import AccessRights from './accessRights'

const TitleContainer = () => {
  const {
    Etsin: {
      EtsinDataset: { datasetMetadata, preservation, isCumulative, isHarvested, isPas },
    },
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  return (
    <Container className="d-md-flex dataset-title">
      <Title lang={getPreferredLang(datasetMetadata.title)}>
        {getValueTranslation(datasetMetadata.title)}
        <span aria-hidden> </span>
        <Translate id="dataset-tags" content="dataset.tags" className="sr-only" element="span" />
        <Tags id="tags">
          {/* Access type */}
          <AccessRights button />
          {/* PAS */}
          {preservation.state > 0 && isPas && (
            <PASLabel>
              <Translate component="span" content="dataset.fairdataPas" />
            </PASLabel>
          )}
          {/* Cumulative */}
          {isCumulative && (
            <Label>
              <Translate content="dataset.cumulative" />
            </Label>
          )}
          {/* Harvested */}
          {isHarvested && (
            <Label>
              <Translate content="dataset.harvested" />
            </Label>
          )}
        </Tags>
      </Title>
    </Container>
  )
}

export default observer(TitleContainer)

const Container = styled.div``

const Title = styled.h1`
  word-break: break-word;
  color: ${p => p.theme.color.superdarkgray};
`

const Tags = styled.span`
  display: inline-flex;
  font-size: 1rem;
  font-weight: normal;
  vertical-align: middle;
  align-items: center;
  padding-bottom: 5px;
  > * {
    margin-left: 0;
  }
`

const Label = styled.div`
  display: inline-block;
  letter-spacing: 0;
  color: ${p => p.theme.color.dark};
  line-height: 1.6;
  margin-right: 0.5em;
  padding: 0.2em 0.9em;
  background-color: #e0e0e0;
  border-radius: 1em;
  max-width: max-content;
`

const PASLabel = styled(Label)`
  background-color: #b3efb0;
`
