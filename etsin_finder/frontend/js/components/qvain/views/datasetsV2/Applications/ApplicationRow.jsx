import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'

import ApplicationState from '@/components/etsin/Dataset/AskForAccess/REMSApplicationState'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '../styled'
import PropTypes from 'prop-types'

const ApplicationRow = ({ application }) => {
  const {
    Locale: { translate, getValueTranslation },
    Qvain: {
      REMSApplications: { setSelectedApplication },
    },
  } = useStores()
  const id = application['application/external-id']

  const resource = application['application/resources'][0]
  const title = getValueTranslation(resource['catalogue-item/title'])
  const link = getValueTranslation(resource['catalogue-item/infourl'])
  return (
    <tr>
      <td>{id}</td>
      <td>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </td>
      <td>{application['application/applicant']['name']}</td>
      <td>
        <ApplicationState application={application} />
      </td>
      <td>
        <IconButton icon={faFile} onClick={() => setSelectedApplication(application)}>
          {translate('qvain.applications.table.view')}
        </IconButton>
      </td>
    </tr>
  )
}

ApplicationRow.propTypes = {
  application: PropTypes.object.isRequired,
}

export default observer(ApplicationRow)
