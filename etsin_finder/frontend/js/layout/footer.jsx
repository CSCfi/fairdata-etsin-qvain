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

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

const Footer = props => {
  const { Env } = props.Stores
  let accessibilityPath = 'fairdata'
  if (Env.separateQvain) {
    accessibilityPath = Env.isQvain ? 'qvain' : 'etsin'
  }
  return (
    <FooterDiv>
      <div className="container">
        <div className="row no-gutters">
          <div className="col col-lg-4 col-md-12 col-sm-12 col-12">
            <Translate component="span" content="footer.fairdata.title" unsafe />
            <Translate component="p" content="footer.fairdata.text" unsafe />
          </div>
          <div className="col padding-right col-lg-2 col-md-3 col-sm-6 offset-lg-1">
            <Translate component="span" content="footer.information.title" unsafe />
            <p>
              <Translate
                component="a"
                content="footer.information.terms"
                attributes={{ href: 'footer.information.termsUrl' }}
                rel="noreferrer"
                target="_blank"
              />
            </p>
            <p>
              <Translate
                component="a"
                content="footer.information.contracts"
                attributes={{ href: 'footer.information.contractsUrl' }}
                rel="noreferrer"
                target="_blank"
              />
            </p>
          </div>
          <div className="col padding-right col-lg-2 col-md-3 col-sm-6 col-6">
            <Translate component="span" content="footer.accessibility.title" unsafe />
            <p>
              <Translate
                component="a"
                content="footer.accessibility.statement"
                attributes={{ href: `footer.accessibility.statementUrls.${accessibilityPath}` }}
                rel="noreferrer"
                target="_blank"
              />
            </p>
          </div>
          <div className="col col-lg-2 col-md-3 col-sm-6 col-6">
            <Translate component="span" content="footer.contact.title" unsafe />
            <p>
              <a href="mailto:servicedesk@csc.fi">servicedesk@csc.fi</a>
            </p>
          </div>
          <div className="col col-lg-1 col-md-3 col-sm-6 col-6">
            <Translate component="span" content="footer.follow.title" unsafe />
            <p>
              <a href="https://twitter.com/Fairdata_fi" rel="noreferrer" target="_blank">
                Twitter
              </a>
            </p>
            <p>
              <Translate
                component="a"
                content="footer.follow.news"
                attributes={{ href: 'footer.follow.newsUrl' }}
                rel="noreferrer"
                target="_blank"
              />
            </p>
          </div>
        </div>
      </div>
    </FooterDiv>
  )
}

Footer.propTypes = {
  Stores: PropTypes.object.isRequired,
}

const FooterDiv = styled.footer.attrs({
  className: 'fd-footer',
})`
  padding-left: 0rem !important;
  padding-right: 0rem !important;
  padding-bottom: 1rem !important;
`

export default inject('Stores')(observer(Footer))
