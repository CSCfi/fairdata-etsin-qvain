{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import styled from 'styled-components'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faUniversity from '@fortawesome/fontawesome-free-solid/faUniversity'
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe'

import { TransparentLink } from '../general/button'
import PopUp from '../general/popup'
import checkDataLang, { getDataLang } from '../../utils/checkDataLang'

export default class Agent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agent: props.agent,
      popUpOpen: false,
      popupAlign: props.popupAlign
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

  infoItem(content, title, icon, lang, key) {
    return (
      <Info key={key}>
        <FontawesomeIcon icon={icon} aria-hidden />
        <span className="sr-only">
          {title}
          {': '}
        </span>
        <span lang={lang}>{content}</span>
      </Info>
    )
  }

  shouldHavePopup = () => this.state.agent.identifier || this.hasExtraInfo()

  hasExtraInfo = () =>
    this.state.agent.contributor_role ||
    this.state.agent.contributor_type ||
    this.state.agent.member_of ||
    this.state.agent.is_part_of ||
    this.state.agent.homepage

  render() {
    if (!this.state.agent.name) {
      return ''
    }
    return (
      <InlineLi>
        {this.props.first ? '' : ' & '}
        {!this.shouldHavePopup() ? (
          <TextWithoutPopup lang={getDataLang(this.state.agent.name)}>
            {checkDataLang(this.state.agent.name)}
          </TextWithoutPopup>
        ) : (
          <PopUp
            isOpen={this.state.popUpOpen}
            onRequestClose={this.closePopUp}
            align={this.state.popupAlign}
            popUp={
              <PopUpContainer>
                {this.state.agent.name && (
                  <Name lang={getDataLang(this.state.agent.name)}>
                    {checkDataLang(this.state.agent.name)}
                  </Name>
                )}
                {this.state.agent.identifier && this.state.agent.identifier.startsWith('http') && (
                  // TODO: fix screenreader reading the link url when the popup is focused. It does not read the content.
                  <IdentifierLink
                    href={this.state.agent.identifier}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={translate('dataset.identifier')}
                  >
                    <IdentifierText>{this.state.agent.identifier}</IdentifierText>
                  </IdentifierLink>
                )}
                {this.state.agent.identifier && !this.state.agent.identifier.startsWith('http') && (
                  <IdentifierText>{this.state.agent.identifier}</IdentifierText>
                )}
                {this.hasExtraInfo() && (
                  <ul>
                    {this.state.agent.member_of &&
                      this.infoItem(
                        (this.state.agent.member_of.is_part_of ?
                          `${checkDataLang(this.state.agent.member_of.is_part_of.name)}, ` : '') +
                          checkDataLang(this.state.agent.member_of.name),
                        translate('dataset.agent.member_of'),
                        faUniversity,
                        getDataLang(this.state.agent.member_of.name)
                      )
                    }
                    {this.state.agent.is_part_of &&
                      this.infoItem(
                        checkDataLang(this.state.agent.is_part_of.name),
                        translate('dataset.agent.is_part_of'),
                        faUniversity,
                        getDataLang(this.state.agent.is_part_of.name)
                      )
                    }
                    {this.state.agent.contributor_role &&
                      this.state.agent.contributor_role.map(cr =>
                        this.infoItem(
                          checkDataLang(cr.pref_label),
                          translate('dataset.agent.contributor_role'),
                          faUser,
                          getDataLang(cr.pref_label),
                          cr.identifier
                        )
                      )
                    }
                    {this.state.agent.contributor_type &&
                      this.state.agent.contributor_type.map(ct =>
                        this.infoItem(
                          checkDataLang(ct.pref_label),
                          translate('dataset.agent.contributor_type'),
                          faUser,
                          getDataLang(ct.pref_label),
                          ct.identifier
                        )
                      )
                    }
                    {this.state.agent.homepage && (
                      <Info>
                        <FontawesomeIcon icon={faGlobe} aria-hidden />
                        <a
                          href={this.state.agent.homepage.identifier}
                          target="_blank"
                          rel="noopener noreferrer"
                          lang={getDataLang(this.state.agent.homepage.description)}
                          title={
                            checkDataLang(this.state.agent.homepage.description) ||
                            this.state.agent.homepage.identifier
                          }
                        >
                          <span className="sr-only">
                            {translate('dataset.agent.homepage')}
                            {' :'}
                          </span>
                          {this.state.agent.homepage.title ? (
                            <span lang={this.state.agent.homepage.title}>
                              {checkDataLang(this.state.agent.homepage.title)}
                            </span>
                          ) : (
                            this.state.agent.homepage.identifier
                          )}
                        </a>
                      </Info>
                    )
                  }
                  </ul>
                )}
              </PopUpContainer>
            }
          >
            <InlineTransparentLink
              noMargin
              noPadding
              color="primary"
              /* eslint-disable-next-line no-script-url */
              href="javascript:;"
              onMouseDown={e => {
                // this prevents the popup not closing and opening
                // when using this button to close
                e.preventDefault()
              }}
              onClick={this.state.popUpOpen ? this.closePopUp : this.openPopUp}
              lang={getDataLang(this.state.agent.name)}
            >
              {(this.state.agent.is_part_of ?
                `${checkDataLang(this.state.agent.is_part_of.name)}, ` : '') +
                checkDataLang(this.state.agent.name)}
            </InlineTransparentLink>
          </PopUp>
        )}
      </InlineLi>
    )
  }
}

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
`

Agent.defaultProps = {
  first: false,
  popupAlign: 'left'
}

Agent.propTypes = {
  first: PropTypes.bool,
  agent: PropTypes.object.isRequired,
  popupAlign: PropTypes.oneOf(['left', 'right', 'center', 'sidebar']),
}

const TextWithoutPopup = styled.span`
  color: ${p => p.theme.color.dark};
  display: inline;
`

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

const IdentifierLink = styled.a`
  font-size: 0.9em;
  word-break: break-word;
`

const IdentifierText = styled.div`
  font-size: 0.9em;
  margin-bottom: 0.5em;
`

const Info = styled.li`
  &:first-of-type {
    margin-top: 0.5em;
  }
  svg {
    color: ${p => p.theme.color.dark};
    margin-right: 0.7em;
  }
`
