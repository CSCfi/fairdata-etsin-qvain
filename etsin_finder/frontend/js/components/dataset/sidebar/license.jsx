import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import styled from 'styled-components'

import checkDataLang from '../../../utils/checkDataLang'
import PopUp from '../../general/popup'
import { LinkButton } from '../../general/button'

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

  renderPopUpContent(data) {
    let link
    if (
      data.license &&
      (data.license.startsWith('http://') || data.license.startsWith('https://'))
    ) {
      link = data.license
    }
    return (
      <div>
        <Name>{checkDataLang(data.title)}</Name>
        <Link href={data.identifier}>{data.identifier}</Link>
        <br />
        {link && <Link href={link}>{link}</Link>}
        {data.description && <Description>{checkDataLang(data.description)}</Description>}
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <MainLink href={this.props.data.identifier} target="_blank" rel="noopener noreferrer">
          {checkDataLang(this.props.data.title)}
        </MainLink>
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
      </React.Fragment>
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
