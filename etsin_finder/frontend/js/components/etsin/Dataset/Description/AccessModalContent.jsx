import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Loader from '@/components/general/loader'
import { SaveButton } from '@/components/qvain/general/buttons'
import { Checkbox } from '@/components/qvain/general/modal/form'
import { useStores } from '@/utils/stores'
import Translate from '@/utils/Translate'
import REMSLicense from './REMSLicense'

const AccessModalContent = () => {
  const [accepted, setAccepted] = useState(false)
  const {
    Locale: { translate },
    Etsin: {
      EtsinDataset: {
        dataset,
        rems: {
          showModal,
          fetchApplicationData,
          createApplication,
          isLoadingApplication,
          isSubmitting,
          licenses,
          applicationDataError,
        },
      },
    },
  } = useStores()

  useEffect(() => {
    if (dataset && showModal) {
      fetchApplicationData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, showModal])

  if (!dataset) {
    return null
  }
  if (isLoadingApplication || applicationDataError) {
    return (
      <>
        <Translate component="h1" content="dataset.access_modal.title" />
        {isLoadingApplication && <Loader active />}
        {applicationDataError && (
          <ErrorDiv>{translate("dataset.access_modal.loadingFailed")}</ErrorDiv>
        )}
        <Buttons>
          <Translate
            component={SaveButton}
            content="dataset.access_modal.submit"
            data-testid="submit-access-application"
            disabled
          />
        </Buttons>
      </>
    )
  }

  const loading = false // Todo

  const terms = []
  const textLicenses = []
  const otherLicenses = []

  for (const license of licenses) {
    if (license.is_data_access_terms) terms.push(license)
    else if (license.licensetype === 'text') textLicenses.push(license)
    else otherLicenses.push(license)
  }
  const hasTerms = terms.length > 0
  const joinedLicenses = [...textLicenses, ...otherLicenses]
  const licenseCount = joinedLicenses.length

  const licenseList = (lics, { isTerms = false } = {}) => (
    <List>
      {lics.map(l => (
        <ListItem key={l.id}>
          <REMSLicense license={l} isDataAccessTerms={isTerms} />
        </ListItem>
      ))}
    </List>
  )

  const getAcceptLabel = () => {
    let label = translate('dataset.access_modal.accept') + ' '
    if (hasTerms) {
      label += translate('dataset.access_modal.acceptTerms') + ' '
    }
    label += translate('dataset.access_modal.acceptLicense', { count: licenseCount })
    return label
  }

  return (
    <>
      <Translate component="h1" content="dataset.access_modal.title" />
      <Wrapper>
        {hasTerms && licenseList(terms, { isTerms: true })}
        <h2>{translate('dataset.access_modal.license', { count: licenseCount })}</h2>
        {licenseList(textLicenses)}
        {licenseList(otherLicenses)}
        <AcceptItem>
          <Checkbox
            id="accept-access-terms"
            data-testid="accept-access-terms"
            disabled={loading}
            value={accepted}
            onClick={() => setAccepted(!accepted)}
          />
          <CheckLabel htmlFor="accept-access-terms">{getAcceptLabel()}</CheckLabel>
        </AcceptItem>
      </Wrapper>
      <Buttons>
        <SaveButton
          component={SaveButton}
          data-testid="submit-access-application"
          onClick={createApplication}
          disabled={isSubmitting || !accepted}
        >
          {translate('dataset.access_modal.submit')}
        </SaveButton>
      </Buttons>
    </>
  )
}

AccessModalContent.propTypes = {}

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li`
  :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const AcceptItem = styled.div`
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
`

const CheckLabel = styled.label`
  padding: 0 1rem;
  flex-grow: 1;
`

const Buttons = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
`

const Wrapper = styled.div`
  overflow-y: auto;
`
const ErrorDiv = styled.div`
  display: flex;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.25em;
  color: white;
  background: ${p => p.theme.color.error};
`

export default observer(AccessModalContent)
