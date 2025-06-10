import { observer } from 'mobx-react'
import styled from 'styled-components'

import { useStores } from '@/utils/stores'
import REMSLicense from './REMSLicense'
import PropTypes from 'prop-types'

const REMSLicenseList = ({ licenses }) => {
  const {
    Locale: { translate },
  } = useStores()
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
        <ListItem key={l['license/id']}>
          <REMSLicense license={l} isDataAccessTerms={isTerms} />
        </ListItem>
      ))}
    </List>
  )

  return (
    <>
      {hasTerms && licenseList(terms, { isTerms: true })}
      <h2>{translate('dataset.access_modal.license', { count: licenseCount })}</h2>
      {licenseList(textLicenses)}
      {licenseList(otherLicenses)}
    </>
  )
}

REMSLicenseList.propTypes = {
  licenses: PropTypes.array,
}

const List = styled.ul`
  list-style: none;
`

const ListItem = styled.li`
  margin-bottom: 0.5rem;
`

export default observer(REMSLicenseList)
