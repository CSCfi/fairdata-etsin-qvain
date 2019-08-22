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
  import { inject, observer } from 'mobx-react'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import {
    faInfoCircle,
    faExclamationTriangle,
    faGlobe,
  } from '@fortawesome/free-solid-svg-icons'
  import styled from 'styled-components'
  import PropTypes from 'prop-types'

  import checkDataLang, { getDataLang } from '../../utils/checkDataLang'
  import Button from '../general/button'
  import Modal from '../general/modal'

  class FairdataPasDatasetIcon extends Component {
    constructor(props) {
      super(props)

      this.state = {
        modalIsOpen: false,
      }

      this.openModal = this.openModal.bind(this)
      this.closeModal = this.closeModal.bind(this)
    }

    openModal() {
      this.setState({ modalIsOpen: true })
    }

    closeModal() {
      this.setState({ modalIsOpen: false })
    }

    render() {
      // Display PAS dataset button on dataset page
      if (this.props.button) {
        return (
          <React.Fragment>
            <CustomButton
              onClick={this.openModal}
              color="lightgray"
              padding="0.2em 0.9em"
              noMargin
              {...this.props}
            >
              <Inner
                lang={getDataLang(this.state.description)}
                title={checkDataLang(this.state.description)}
              >
                <div>
                  <AccessLabel lang={getDataLang(this.state.title)}>
                    Fairdata PAS
                  </AccessLabel>
                </div>
              </Inner>
            </CustomButton>
            {/* POPUP modal */}
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              contentLabel="Access Modal"
            >
              <ModalInner>
                {this.state.description && (
                  <div>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <AccessLabel lang={getDataLang(this.state.description)}>
                      {checkDataLang(this.state.description)}
                    </AccessLabel>
                  </div>
                )}
                {this.state.url && (
                  <div>
                    <FontAwesomeIcon icon={faGlobe} />
                    <AccessUrl
                      href={this.state.url.identifier}
                      title={this.state.url.identifier}
                      lang={getDataLang(this.state.url.title)}
                    >
                      {checkDataLang(this.state.url.title)}
                    </AccessUrl>
                  </div>
                )}
                {this.state.restriction_grounds &&
                  this.state.restriction_grounds.map(rg => (
                    <div key={`div-rg-${rg.identifier}`}>
                      <FontAwesomeIcon key={`fai-rg-${rg.identifier}`} icon={faExclamationTriangle} />
                      <AccessLabel key={`al-rg-${rg.identifier}`} lang={getDataLang(rg.pref_label)}>
                        {checkDataLang(rg.pref_label)}
                      </AccessLabel>
                    </div>
                  ))}
              </ModalInner>
            </Modal>
          </React.Fragment>
        )
      }
      // Display only main info on results list
      return (
        <Access {...this.props}>
          <Inner
            title={checkDataLang(this.state.description)}
            lang={getDataLang(this.state.description)}
          >
            <div>
              <AccessLabel lang={getDataLang(this.state.title)}>
                Fairdata PAS
              </AccessLabel>
            </div>
          </Inner>
        </Access>
      )
    }
  }

  export default inject('Stores')(observer(FairdataPasDatasetIcon))
  export const undecorated = FairdataPasDatasetIcon

  const Access = styled.div`
    padding: 0.2em 0.9em;
    background-color: #EFE4B0;
    border-radius: 1em;
    margin-right: 5px;
  `

  const CustomButton = styled(Button)`
    border-radius: 1em;
    color: ${p => p.theme.color.dark};
  `

  const AccessLabel = styled.div`
    display: inline;
  `

  const AccessUrl = styled.a`
    display: inline;
  `

  const Inner = styled.div`
    max-width: 100%;
    @media screen and (min-width: ${p => p.theme.breakpoints.md}) {
      width: max-content;
      max-width: 14em;
    }
    svg {
      margin-right: 0.5em;
    }
  `

  const ModalInner = styled.div`
    max-width: 100%;
    svg {
      margin-right: 1.5em;
    }
    & > div:not(:last-child) {
      margin-bottom: 0.2em;
    }
  `

  FairdataPasDatasetIcon.defaultProps = {
    access_rights: undefined,
    button: false,
  }

  FairdataPasDatasetIcon.propTypes = {
    button: PropTypes.bool,
    access_rights: PropTypes.shape({
      description: PropTypes.object,
      access_url: PropTypes.object,
      access_type: PropTypes.shape({
        identifier: PropTypes.string.isRequired,
        pref_label: PropTypes.objectOf(PropTypes.string),
      }),
      restriction_grounds: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      license: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }),
    Stores: PropTypes.object.isRequired,
  }
