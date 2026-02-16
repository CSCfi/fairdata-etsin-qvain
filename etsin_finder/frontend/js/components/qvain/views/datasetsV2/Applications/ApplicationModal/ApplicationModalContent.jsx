import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'

import ApplicationState from '@/components/etsin/Dataset/AskForAccess/REMSApplicationState'
import { Tab, TabRow } from '@/components/general/Tab'
import ApplicationDetails from './ApplicationDetails'
import ApplicationEvents from './ApplicationEvents'
import Loader from '@/components/general/loader'

const ApplicationModalContent = observer(() => {
  const {
    Locale: { translate, getValueTranslation },
    Qvain: {
      REMSApplications: {
        selectedAction,
        selectedApplication,
        fetchSelectedApplicationDetails,
        tabs,
      },
    },
  } = useStores()

  const ref = useRef()
  useEffect(() => {
    if (selectedAction) {
      globalThis.setTimeout(() => {
        if (ref.current?.scrollTo) {
          ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'instant' })
        }
      })
    }
  }, [selectedAction])

  const application = selectedApplication
  useEffect(() => {
    if (!application.hasDetails) {
      fetchSelectedApplicationDetails()
    }
  }, [application.hasDetails, fetchSelectedApplicationDetails])

  let content = <ApplicationDetails />
  if (tabs.active === 'events') {
    content = <ApplicationEvents />
  }
  if (!application.hasDetails) {
    content = <Loader active size="6rem" />
  }

  const id = application['application/external-id']
  const resource = application['application/resources'][0]
  const title = getValueTranslation(resource['catalogue-item/title'])
  const link = getValueTranslation(resource['catalogue-item/infourl'])

  return (
    <>
      <TitleRow>
        <h2>
          {translate('qvain.applications.modal.application')} {id}
        </h2>
        <ApplicationState application={application} />
      </TitleRow>
      <InfoRow>
        {translate('qvain.applications.modal.dataset')}{' '}
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </InfoRow>
      <ModalTabRow>
        {Object.entries(tabs.options).map(([id, label]) => (
          <ModalTab
            key={id}
            aria-selected={tabs.active === id}
            onClick={() => tabs.setActive(id)}
            className={`tab-${id}`}
          >
            {translate(label)}
          </ModalTab>
        ))}
      </ModalTabRow>
      <TabContent ref={ref}>{content}</TabContent>
    </>
  )
})

const TitleRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  h2 {
    margin-bottom: 0;
  }
`

const InfoRow = styled.div`
  margin-bottom: 0.5rem;
`

const ModalTab = styled(Tab)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 2rem;
  flex-wrap: wrap;
  line-height: 1.5;
  column-gap: 0.5rem;
`

const ModalTabRow = styled(TabRow)`
  padding-left: 0;
  gap: 0;
`

const TabContent = styled.div`
  overflow-y: auto;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export default ApplicationModalContent
