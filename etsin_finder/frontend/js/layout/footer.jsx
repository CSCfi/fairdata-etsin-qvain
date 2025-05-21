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

import styled from 'styled-components'
import Translate from '@/utils/Translate'

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
              <a
                href="https://bsky.app/profile/fairdata.fi"
                rel="noreferrer noopener"
                target="_blank"
                title="Follow us on Bluesky"
              >
                <SVGLogo
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 568 501"
                  width="20px"
                >
                  <path
                    fill="#1185FE"
                    d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32
                    160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275
                    72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86
                    122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631
                    7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72
                    11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
                  />
                </SVGLogo>
                @fairdata.fi
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

const SVGLogo = styled.svg`
  margin-right: 4px;
  vertical-align: middle;
`

export default Footer
