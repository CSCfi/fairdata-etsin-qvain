import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import { useStores } from '@/stores/stores'

import AccessRights from './accessRights'

const TitleContainer = () => {
  const {
    Etsin: {
      EtsinDataset: { dataset, isCumulative, isHarvested },
    },
  } = useStores()

  return (
    <Container className="d-md-flex dataset-title">
      <Title lang={getDataLang(dataset.title)}>
        {checkDataLang(dataset.title)}
        <span aria-hidden> </span>
        <Translate id="dataset-tags" content="dataset.tags" className="sr-only" element="span" />
        <Tags id="tags">
          <AccessRights button />
          {isCumulative && (
            <Label>
              <Translate content="dataset.cumulative" />
            </Label>
          )}
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

const Container = styled.div`
  margin: 1.3em 0;
  }
`

const Title = styled.h1`
  margin: 0.5rem 0.5rem 0.5rem 0;
  word-break: break-word;
  color: ${p => p.theme.color.superdarkgray};
`

const Tags = styled.span`
  display: inline-flex;
  font-size: 1rem;
  font-weight: normal;
  vertical-align: middle;
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
  }
`
