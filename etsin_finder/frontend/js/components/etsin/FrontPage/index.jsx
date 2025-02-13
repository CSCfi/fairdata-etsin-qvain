import React, { useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'

import SearchBar from '@/components/etsin/FrontPage/SearchBar'
import { useStores } from '@/stores/stores'

const FrontPageV3 = () => {
  const {
    Accessibility,
    Matomo: { recordEvent },
    Etsin: {
      Search: { overallCount, fetchOverallCount },
    },
  } = useStores()

  useEffect(() => {
    Accessibility.handleNavigation('home')
    recordEvent('HOME')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchOverallCount()
  }, [fetchOverallCount, overallCount, recordEvent, Accessibility])

  return (
    <div className="search-page">
      <HeroBanner className="hero-primary">
        {overallCount && (
          <div className="container">
            <section className="text-center">
              <h1>
                <Translate content="home.titleV3" />
                &nbsp;
                {overallCount !== null && (
                  <Translate with={{ count: overallCount }} content="home.count" />
                )}
              </h1>
              <SearchBar />
            </section>
          </div>
        )}
      </HeroBanner>
      <div className="container">
        <div className="regular-row">
          <TextHolder>
            <article>
              <section>
                <Translate content="home.title1" component="h2" />
                <Translate content="home.para1" component="p" unsafe />
              </section>
              <section>
                <Translate content="home.title2" component="h2" />
                <Translate content="home.para2" component="p" unsafe />
              </section>
            </article>
          </TextHolder>
        </div>
      </div>
    </div>
  )
}

const TextHolder = styled.div`
  max-width: 50rem;
  margin: 0 auto;
  p {
    white-space: pre-line;
  }
`

const HeroBanner = ({ className, children }) => (
  <Hero className={className}>
    <Center>{children}</Center>
  </Hero>
)

const Hero = styled.div`
  width: 100%;
  min-height: 200px;
  /* display: flex;
    align-items: center;
    justify-content: center; */
  position: relative;
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    min-height: 300px;
  }
  &.hero-primary {
    background-color: ${props => props.theme.color.primary};
    color: white;
  }
  &.hero-full {
    width: 100%;
  }
`

const Center = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
`

HeroBanner.defaultProps = {
  className: '',
  children: null,
}

HeroBanner.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default observer(FrontPageV3)
