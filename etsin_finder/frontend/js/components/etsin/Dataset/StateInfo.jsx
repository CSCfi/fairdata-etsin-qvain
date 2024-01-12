import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { opacify } from 'polished'

import Loader from '@/components/general/loader'
import { useStores } from '@/stores/stores'

const RelatedDatasetLoadSpinner = () => (
  <LoadingSplash margin="1rem">
    <Loader active />
  </LoadingSplash>
)

const OtherIdentifiers = otherIdentifiers =>
  otherIdentifiers.identifiers.map(identifier => (
    <div key={identifier.identifier}>
      <Translate
        with={{ identifier: identifier.identifier }}
        content="tombstone.urlToOtherIdentifier"
      />
      <> </>
      <Translate
        href={`/dataset/${identifier.metax_identifier}`}
        component={Link}
        content="tombstone.linkTextToOtherIdentifier"
      />
    </div>
  ))

const Relations = observer(relations => {
  const {
    Locale: { lang },
  } = useStores()

  return relations.relations.map(relation => (
    <div key={relation.identifier}>
      <Translate with={{ type: relation.type.pref_label[lang] }} content="tombstone.urlToRelated" />
      <> </>
      <Translate
        href={`/dataset/${relation.metax_identifier}`}
        component={Link}
        content="tombstone.linkTextToRelated"
      />
    </div>
  ))
})

const StateDescription = observer(() => {
  const {
    Etsin: {
      EtsinDataset: {
        tombstoneInfotext,
        latestExistingVersionInfotext,
        latestExistingVersionId,
        groupedRelations,
      },
      isLoading,
    },
  } = useStores()

  return (
    <>
      <Translate component={StateHeader} content={tombstoneInfotext} />
      {latestExistingVersionInfotext?.urlText && (
        <Translate content={latestExistingVersionInfotext?.urlText} />
      )}
      {latestExistingVersionId && (
        <>
          <> </>
          <Link
            href={`/dataset/${latestExistingVersionId}`}
            target="_blank"
            rel="noopener noreferrer"
            content={'tombstone.link'}
          >
            <Translate content={latestExistingVersionInfotext?.linkToOtherVersion} />
          </Link>
        </>
      )}

      {isLoading.relations && <RelatedDatasetLoadSpinner />}

      {groupedRelations && (
        <>
          <OtherIdentifiers identifiers={groupedRelations.otherIdentifiers} />
          <Relations relations={groupedRelations.relations} />
        </>
      )}
    </>
  )
})

const StateInfoBox = () => {
  const {
    Etsin: {
      EtsinDataset: { isRemoved, isDeprecated },
    },
  } = useStores()

  if (isRemoved) {
    return (
      <div className="fd-alert fd-danger">
        <StateDescription />
      </div>
    )
  }

  if (isDeprecated) {
    return (
      <DeprecationInfo>
        <StateDescription />
      </DeprecationInfo>
    )
  }

  return null
}

const StateHeader = styled.p`
  font-weight: bold;
  &:last-child {
    margin-bottom: 0;
  }
`

const DeprecationInfo = styled.div`
  background-color: ${p => p.theme.color.primaryLight};
  text-align: left;
  color: ${p => p.theme.color.primaryDark};
  border: 1px solid ${p => opacify(-0.5, p.theme.color.primary)};
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`

const LoadingSplash = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: left;
  margin: ${({ margin = 0 }) => margin};
`

const Link = styled.a`
  font-size: 0.9em;
  color: ${p => p.theme.color.linkColorUIV2};
`

export default observer(StateInfoBox)
