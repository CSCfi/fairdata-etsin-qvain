import React from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { FAIRDATA_WEBSITE_URL } from '../../../utils/constants'

const Description = props => {
  const { lang } = props.Stores.Locale
  const helpUrl = lang === 'fi' ? FAIRDATA_WEBSITE_URL.QVAIN.FI : FAIRDATA_WEBSITE_URL.QVAIN.EN
  return (
    <>
      <Header>Qvain</Header>
      <Translate component={Brief} content="qvain.home.brief" />
      <Translate component="p" content="qvain.home.description" />
      <p>
        <Translate component="a" href={helpUrl} content="qvain.home.howTo" />
      </p>
    </>
  )
}

Description.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const Header = styled.h1`
  font-weight: bold;
  line-height: 1.2;
  font.size: 36px;
`

const Brief = styled.h5`
  font-size: 20px;
  font-weight: normal;
  margin-bottom: 1rem;
`

export default inject('Stores')(observer(Description))
