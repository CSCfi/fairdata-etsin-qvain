import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import styled from 'styled-components'

import checkDataLang, { getDataLang } from '../../../../utils/checkDataLang'
import PopUp from '../../../general/popup'
import { LinkButton } from '../../../general/button'

export default class License extends Component {
  static propTypes = {
    data: PropTypes.shape({
      license: PropTypes.string,
      title: PropTypes.object,
      identifier: PropTypes.string.isRequired,
      description: PropTypes.object,
    }).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      popUpOpen: false,
    }
  }

  openPopUp = () => {
    this.setState({
      popUpOpen: true,
    })
  }

  closePopUp = () => {
    this.setState({
      popUpOpen: false,
    })
  }

  licenseIsUrl(license) {
    return license.startsWith('http://') || license.startsWith('https://')
  }

  renderPopUpContent(data) {
    let link
    if (data.license && this.licenseIsUrl(data.license)) {
      link = data.license
    }
    return (
      <div>
        <Name lang={getDataLang(data.title)}>{checkDataLang(data.title)}</Name>
        <br />
        {data.description && (
          <Description lang={getDataLang(data.description)}>
            {checkDataLang(data.description)}
          </Description>
        )}
        <br />
        {link && (
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </Link>
        )}
        {!link && data.license}
      </div>
    )
  }

  render() {
    const licenseIsUrl = this.props.data.license && this.licenseIsUrl(this.props.data.license)
    return (
      <span>
        {licenseIsUrl && (
          <MainLink
            href={this.props.data.license}
            target="_blank"
            rel="noopener noreferrer"
            lang={getDataLang(this.props.data.title)}
          >
            {checkDataLang(this.props.data.title)}
          </MainLink>
        )}
        {!licenseIsUrl && (
          <span lang={getDataLang(this.props.data.title)}>
            {checkDataLang(this.props.data.title)}
          </span>
        )}
        {this.props.data.description && (
          <PopUp
            popUp={this.renderPopUpContent(this.props.data)}
            isOpen={this.state.popUpOpen}
            onRequestClose={this.closePopUp}
            align="sidebar"
          >
            <LinkButton
              onMouseDown={e => {
                // this prevents the popup not closing and opening
                // when using this button to close
                e.preventDefault()
              }}
              onClick={this.openPopUp}
              noMargin
              noPadding
            >
              <FontawesomeIcon icon={faInfoCircle} />
            </LinkButton>
          </PopUp>
        )}
      </span>
    )
  }
}

const Name = styled.h4`
  margin-bottom: 0;
  font-size: 1.1em;
  color: ${p => p.theme.color.dark};
  line-height: 1;
`

const MainLink = styled.a`
  margin-right: 0.2em;
`

const Link = styled.a`
  font-size: 0.9em;
`

const Description = styled.p`
  margin-top: 0.5em;
  margin-bottom: 0;
  padding: 0.4em 0.5em;
  border-left: 2px solid ${p => p.theme.color.primary};
  font-size: 0.9em;
`
