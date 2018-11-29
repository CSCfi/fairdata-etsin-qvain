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
import Translate from 'react-translate-component'
import styled from 'styled-components'
import FontawesomeIcon from '@fortawesome/react-fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faUniversity from '@fortawesome/fontawesome-free-solid/faUniversity'
import faGlobe from '@fortawesome/fontawesome-free-solid/faGlobe'

import { TransparentLink } from '../../general/button'
import PopUp from '../../general/popup'
import GetLang from '../../general/getLang'

export default class Agent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agent: props.agent,
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

  shouldHavePopup = () =>
    this.state.agent.identifier ||
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
          <GetLang
            content={this.state.agent.name}
            render={data => (
              <TextWithoutPopup lang={data.lang}>{data.translation}</TextWithoutPopup>
            )}
          />
        ) : (
          <PopUp
            isOpen={this.state.popUpOpen}
            onRequestClose={this.closePopUp}
            popUp={
              <PopUpContainer>
                {this.state.agent.name && (
                  <GetLang
                    content={this.state.agent.name}
                    render={data => <Name lang={data.lang}>{data.translation}</Name>}
                  />
                )}
                {this.state.agent.identifier && this.state.agent.identifier.startsWith('http') && (
                  <IdentifierLink
                    href={this.state.agent.identifier}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {this.state.agent.identifier}
                  </IdentifierLink>
                )}
                {this.state.agent.identifier && !this.state.agent.identifier.startsWith('http') && (
                  <IdentifierText>{this.state.agent.identifier}</IdentifierText>
                )}
                {this.state.agent.contributor_role &&
                  this.state.agent.contributor_role.map(cr => (
                    <Info key={cr.identifier} title={translate('dataset.agent.contributor_role')}>
                      <FontawesomeIcon icon={faUser} />
                      <Translate content="dataset.agent.contributor_role" className="sr-only" />
                      <span className="sr-only">{' :'}</span>
                      <GetLang
                        content={cr.pref_label}
                        render={data => <span lang={data.lang}>{data.translation}</span>}
                      />
                    </Info>
                  ))}
                {this.state.agent.contributor_type &&
                  this.state.agent.contributor_type.map(ct => (
                    <Info key={ct.identifier} title={translate('dataset.agent.contributor_type')}>
                      <FontawesomeIcon icon={faUser} />
                      <Translate content="dataset.agent.contributor_type" className="sr-only" />
                      <span className="sr-only">{' :'}</span>
                      <GetLang
                        content={ct.pref_label}
                        render={data => <span lang={data.lang}>{data.translation}</span>}
                      />
                    </Info>
                  ))}
                {this.state.agent.member_of && (
                  <Info title={translate('dataset.agent.member_of')}>
                    <FontawesomeIcon icon={faUniversity} />
                    <Translate content="dataset.agent.member_of" className="sr-only" />
                    <span className="sr-only">{' :'}</span>
                    <GetLang
                      content={this.state.agent.member_of.name}
                      render={data => <span lang={data.lang}>{data.translation}</span>}
                    />
                  </Info>
                )}
                {this.state.agent.is_part_of && (
                  <Info title={translate('dataset.agent.is_part_of')}>
                    <FontawesomeIcon icon={faUniversity} />
                    <Translate content="dataset.agent.is_part_of" className="sr-only" />
                    <span className="sr-only">{' :'}</span>
                    <GetLang
                      content={this.state.agent.is_part_of.name}
                      render={data => <span lang={data.lang}>{data.translation}</span>}
                    />
                  </Info>
                )}
                {this.state.agent.homepage && (
                  <Info>
                    <FontawesomeIcon icon={faGlobe} title={translate('dataset.agent.homepage')} />
                    <GetLang
                      content={this.state.agent.homepage.description}
                      render={data => (
                        <a
                          href={this.state.agent.homepage.identifier}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={data.translation || this.state.agent.homepage.identifier}
                          lang={data.translation ? data.lang : undefined}
                        >
                          <Translate content="dataset.agent.homepage" className="sr-only" />
                          <span className="sr-only">{' :'}</span>
                          {this.state.agent.homepage.title ? (
                            <GetLang
                              content={this.state.agent.homepage.title}
                              render={r => <span lang={r.lang}>{r.translation}</span>}
                            />
                          ) : (
                            <span>{this.state.agent.homepage.identifier}</span>
                          )}
                        </a>
                      )}
                    />
                  </Info>
                )}
              </PopUpContainer>
            }
          >
            <TransparentLink
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
            >
              <GetLang
                content={this.state.agent.name}
                render={data => <span lang={data.lang}>{data.translation}</span>}
              />
            </TransparentLink>
          </PopUp>
        )}
      </InlineLi>
    )
  }
}

Agent.defaultProps = {
  first: false,
}

Agent.propTypes = {
  first: PropTypes.bool,
  agent: PropTypes.object.isRequired,
}

const TextWithoutPopup = styled.span`
  color: ${p => p.theme.color.dark};
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
`

const IdentifierText = styled.div`
  font-size: 0.9em;
  margin-bottom: 0.5em;
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
