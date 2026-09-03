// NOTE: react-helmet-async is used here via the Helmet component (also used
// in App via HelmetProvider and in dataset-related tests). This dependecy can
// likely be removed when upgrading to a newer React major version.
import { Helmet } from 'react-helmet-async'
import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import { orcidToUrl } from '@/utils/orcidToUrl'

function HeadLinks() {
  const {
    Etsin: {
      EtsinDataset: { creators, pidLink, accessRights, metadataLink, doiLink },
    },
  } = useStores()

  const getAuthorUrl = () => {
    // Finds the first creator person that has an ORCID identifier.
    // Only the first matching creator is used to keep the document head
    // lightweight, in accordance with the Signposting FAIR documentation
    // (https://signposting.org/FAIR/).
    if (creators?.length > 0) {
      for (const creator of creators) {
        const orcidUrl = orcidToUrl(creator?.person?.external_identifier)
        if (orcidUrl !== '') {
          return orcidUrl
        }
      }
    }

    return null
  }

  const authorUrl = getAuthorUrl()

  return (
    <>
      {/* Add <link> elements to the document head to support signposting.  
          rel="item" links for files are currently omitted due to the 
          complexity of access rights handling and to avoid excessive growth 
          of the document head. */}
      <Helmet>
        {pidLink && <link key="cite-as" rel="cite-as" href={pidLink} />}
        <link key="type-1" rel="type" href="https://schema.org/Dataset" />
        <link key="type-2" rel="type" href="https://schema.org/AboutPage" />
        {authorUrl && <link key="author" rel="author" href={authorUrl} />}
        {metadataLink && (
          <link
            key="describedby-json"
            rel="describedby"
            type="application/json"
            href={metadataLink}
          />
        )}
        {doiLink && (
          <link
            key="describedby-ld-json"
            rel="describedby"
            type="application/ld+json"
            href={doiLink}
          />
        )}
        {doiLink && (
          <link
            key="describedby-datacite-json"
            rel="describedby"
            type="application/vnd.datacite.datacite+json"
            href={doiLink}
          />
        )}
        {accessRights?.license?.length > 0 &&
          accessRights.license.map(l => {
            if (l.url) {
              return <link key={l.url} rel="license" href={l.url} />
            }
          })}
      </Helmet>
    </>
  )
}

export default observer(HeadLinks)
