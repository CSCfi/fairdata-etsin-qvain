import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'

import Field from '../general/field'
import Card from '../general/card'

const TooltipContent = () => (
  <>
    <Translate component="h2" content="qvain.project.organization.title" />
    <Translate component="div" content="qvain.project.organization.description" />
  </>
)

const fieldProps = {
  translations: {
    title: 'qvain.project.organization.title',
    tooltip: 'qvain.project.organization.description',
  },
  components: {
    tooltipContent: TooltipContent,
  }
}

const FundingOrganization = ({ Stores }) => {

  const renderSelectedOrganizations = () => null

  return (
    <Field {...fieldProps}>
      <Card>
        <Translate component="h3" content="qvain.project.organization.title" />
        <Translate component="p" content="qvain.project.organization.description" />
        { renderSelectedOrganizations() }
      </Card>
    </Field>
  )
}

FundingOrganization.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const OrganizationField = ({ Stores }) => {

}

OrganizationField.propTypes = {
  Stores: PropTypes.object.isRequired,
}


export default inject('Stores')(observer(FundingOrganization))
