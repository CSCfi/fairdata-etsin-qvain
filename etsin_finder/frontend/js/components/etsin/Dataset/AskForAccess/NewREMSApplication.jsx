import { observer } from 'mobx-react'
import styled from 'styled-components'

import Loader from '@/components/general/loader'
import { SaveButton } from '@/components/qvain/general/buttons'
import { Checkbox } from '@/components/qvain/general/modal/form'
import { useStores } from '@/utils/stores'
import REMSLicenseList from './REMSLicenseList'

const AccessModalContent = () => {
  const {
    Locale: { translate },
    Etsin: {
      EtsinDataset: {
        rems: {
          createApplication,
          isLoadingApplicationBase,
          isSubmitting,
          applicationBaseError,
          applicationBase,
          acceptLicenses,
          setAcceptLicenses,
        },
      },
    },
  } = useStores()

  const licenses = applicationBase?.['application/licenses'] || []
  const hasTerms = licenses.filter(l => l.is_data_access_terms).length > 0
  const licenseCount = licenses.filter(l => !l.is_data_access_terms).length

  const getAcceptLabel = () => {
    let label = translate('dataset.access_modal.accept') + ' '
    if (hasTerms) {
      label += translate('dataset.access_modal.acceptTerms') + ' '
    }
    label += translate('dataset.access_modal.acceptLicense', { count: licenseCount })
    return label
  }

  let content
  if (isLoadingApplicationBase) {
    content = <Loader active />
  } else if (applicationBaseError) {
    content = <ErrorDiv>{translate('dataset.access_modal.loadingFailed')}</ErrorDiv>
  } else {
    content = (
      <Wrapper>
        <REMSLicenseList licenses={licenses} />
        <AcceptItem>
          <Checkbox
            id="accept-access-terms"
            data-testid="accept-access-terms"
            disabled={isSubmitting}
            value={acceptLicenses}
            onClick={() => setAcceptLicenses(!acceptLicenses)}
          />
          <CheckLabel htmlFor="accept-access-terms">{getAcceptLabel()}</CheckLabel>
        </AcceptItem>
      </Wrapper>
    )
  }

  return (
    <>
      <h1>{translate('dataset.access_modal.title')}</h1>
      {content}
      <Buttons>
        <SaveButton
          component={SaveButton}
          data-testid="submit-access-application"
          onClick={createApplication}
          disabled={
            isSubmitting || !acceptLicenses || isLoadingApplicationBase || applicationBaseError
          }
        >
          {translate('dataset.access_modal.submit')}
        </SaveButton>
      </Buttons>
    </>
  )
}

AccessModalContent.propTypes = {}

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
  flex-shrink: 99999;
  flex-grow: 1;
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
