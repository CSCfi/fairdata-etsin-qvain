import React, { Component } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import Translate from 'react-translate-component'
import styled from 'styled-components'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faUniversity from '@fortawesome/fontawesome-free-solid/faUniversity'
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe'

// import checkDataLang from '../../utils/checkDataLang'
import { TransparentButton } from '../../general/button'
import PopUp from '../../general/popup'
import checkDataLang from '../../../utils/checkDataLang'

export default class Person extends Component {
  constructor(props) {
    super(props)
    this.state = {
      person: props.person,
      popUpOpen: false,
    }
    this.openPopUp = this.openPopUp.bind(this)
    this.closePopUp = this.closePopUp.bind(this)
  }

  openPopUp() {
    this.setState({
      popUpOpen: true,
    })
  }

  closePopUp() {
    this.setState({
      popUpOpen: false,
    })
  }

  render() {
    return (
      <InlineLi>
        {this.props.first ? '' : ', '}
        <PopUp
          isOpen={this.state.popUpOpen}
          onRequestClose={this.closePopUp}
          popUp={
            <PopUpContainer>
              <Name>{this.state.person.name}</Name>
              {this.state.person.identifier && (
                <Orcid href={this.state.person.identifier}>{this.state.person.identifier}</Orcid>
              )}
              {this.state.person.contributor_role && (
                <Info>
                  <FontawesomeIcon
                    icon={faUser}
                    title={translate('dataset.person.contributor_role')}
                  />
                  <Translate content="dataset.person.contributor_role" className="sr-only" />
                  <span className="sr-only">{' :'}</span>
                  <span>{checkDataLang(this.state.person.contributor_role.pref_label)}</span>
                </Info>
              )}
              {this.state.person.member_of && (
                <Info>
                  <FontawesomeIcon
                    icon={faUniversity}
                    title={translate('dataset.person.member_of')}
                  />
                  <Translate content="dataset.person.member_of" className="sr-only" />
                  <span className="sr-only">{' :'}</span>
                  <span>{checkDataLang(this.state.person.member_of.name)}</span>
                </Info>
              )}
              {this.state.person.homepage && (
                <Info>
                  <FontawesomeIcon icon={faGlobe} title={translate('dataset.person.homepage')} />
                  <a
                    href={this.state.person.homepage.identifier}
                    title={
                      this.state.person.homepage.description ||
                      this.state.person.homepage.identifier
                    }
                  >
                    <Translate content="dataset.person.homepage" className="sr-only" />
                    <span className="sr-only">{' :'}</span>
                    {checkDataLang(this.state.person.homepage.title)}
                  </a>
                </Info>
              )}
            </PopUpContainer>
          }
        >
          <TransparentButton
            noMargin
            noPadding
            color="primary"
            onMouseDown={e => {
              // this prevents the popup not closing and opening
              // when using this button to close
              e.preventDefault()
            }}
            onClick={this.state.popUpOpen ? this.closePopUp : this.openPopUp}
          >
            {this.state.person.name}
          </TransparentButton>
        </PopUp>
      </InlineLi>
    )
  }
}

Person.propTypes = {
  first: PropTypes.bool.isRequired,
  person: PropTypes.object.isRequired,
}

const PopUpContainer = styled.div`
  min-width: 13em;
`

const InlineLi = styled.li`
  list-style: none;
  display: inline;
`

const Name = styled.h4`
  margin-bottom: 0;
  font-size: 1.1em;
  color: ${p => p.theme.color.dark};
  line-height: 1;
`

const Orcid = styled.a`
  font-size: 0.9em;
`

const Info = styled.div`
  &:first-of-type {
    margin-top: 0.5em;
  }
  svg {
    color: ${p => p.theme.color.dark};
    margin-right: 0.7em;
  }
`
