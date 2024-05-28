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
import Translate from 'react-translate-component'
import styled from 'styled-components'

import imgEOSC from '../../static/images/Supporting_EOSC.jpg'

const Footer = () => {
  const accessibilityPath = 'fairdata'

  return (
    <FooterDiv>
      <div className="container">
        <div className="row no-gutters">
          <PaddedFlexBox>
            <a href="https://www.fairdata.fi/en/fairdata-services/">
              <Banner src={imgEOSC} alt="Supporting EOSC" />
            </a>
            <Translate component="span" content="footer.fairdata.title" unsafe />
            <Translate component="p" content="footer.fairdata.text" unsafe />
          </PaddedFlexBox>
          <div className="col padding-right col-lg-2 col-md-3 col-sm-6">
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
          <div className="col col-lg-2 col-md-3 col-sm-6 col-6">
            <Translate component="span" content="footer.follow.title" unsafe />
            <p>
              <a href="https://x.com/Fairdata_fi" rel="noreferrer" target="_blank">
                X @Fairdata_fi
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

const FooterDiv = styled.footer.attrs({
  className: 'fd-footer',
})`
  padding: 1rem 0 !important;

  @media screen and (max-width: 992px) {
    span {
      margin-top: 0.75rem;
      margin-bottom: 0.5rem;
    }
  }
`

const Banner = styled.img`
  width: 175px;
  float: right;
  margin-top: 0.2rem;
`

const PaddedFlexBox = styled.div.attrs({
  className: 'col col-lg-4 col-md-12 col-sm-12 col-12',
})`
  @media screen and (min-width: 992px) {
    padding-right: 1.5rem !important;
  }

  @media screen and (max-width: 992px) {
    margin-bottom: 0.75rem;
  }
`

export default Footer
