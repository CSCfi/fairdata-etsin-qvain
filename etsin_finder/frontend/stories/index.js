import React, { Fragment } from 'react'
import { Provider } from 'mobx-react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { storiesOf, addDecorator } from '@storybook/react'

import Stores from '../js/stores'
import theme from '../js/theme'
import Hero from '../js/components/general/hero'
import LangToggle from '../js/components/general/navigation/langToggle'
import Button, {
  InvertedButton,
  Link,
  TransparentButton,
  LinkButton,
} from '../js/components/general/button'
import Splash from '../js/components/general/splash'
import ResultsAmount from '../js/components/search/resultsAmount'
import SortResults from '../js/components/search/sortResults'
import SearchBar from '../js/components/search/searchBar'
import Pagination from '../js/components/search/pagination'
import ListItem from '../js/components/search/resultslist/listItem'
import ErrorPage from '../js/components/errorpage'
import Identifier from '../js/components/dataset/data/identifier'
import AccessRights from '../js/components/dataset/data/accessRights'
import Footer from '../js/layout/footer'
import Loader from '../js/components/general/loader'
import Separator from '../js/components/general/separator'
import SkipToContent from '../js/components/general/skipToContent'
import VersionChanger from '../js/components/dataset/versionChanger'
import Tabs from '../js/components/dataset/tabs'

import EsRes from './esRes'
import MetaxRes from './metaxRes'

/* eslint-disable */

const AppDecorator = storyFn => (
  <Provider Stores={Stores}>
    <Router history={Stores.history}>
      <ThemeProvider theme={theme}>
        <Fragment>
          <LangToggle />
          {storyFn()}
        </Fragment>
      </ThemeProvider>
    </Router>
  </Provider>
)
addDecorator(AppDecorator)

const Container = styled.div`
  width: 100%;
  max-width: ${props => (props.maxWidth ? props.maxWidth : '100%')};
  padding: 1em;
`

storiesOf('General/Hero', module).add('Normal', () => (
  <Hero className="hero-primary">
    <h1>Basic Hero</h1>
  </Hero>
))

storiesOf('General/Button', module)
  .add('Primary buttons', () => (
    <Container>
      <Button>Primary</Button>
      <InvertedButton>Inverted</InvertedButton>
      <Link href="https://google.com">Link</Link>
      <TransparentButton>Transparent Button</TransparentButton>
      <LinkButton>LinkButton</LinkButton>
    </Container>
  ))
  .add('Color error', () => (
    <Container>
      <Button color={theme.color.error}>Primary</Button>
      <InvertedButton color={theme.color.error}>Inverted</InvertedButton>
      <Link href="https://google.com" color={theme.color.error}>
        Link
      </Link>
      <TransparentButton color={theme.color.error}>Transparent Button</TransparentButton>
      <LinkButton color={theme.color.error}>LinkButton</LinkButton>
    </Container>
  ))
  .add('Custom', () => (
    <Container>
      <p>No Margin</p>
      <Button noMargin>Button</Button>
      <Separator />
      <p>Custom margin</p>
      <Button margin="1em 2em">Button</Button>
      <Separator />
      <p>No Padding</p>
      <TransparentButton noPadding>Click me!</TransparentButton>
      <Separator />
      <p>Custom padding</p>
      <Button padding="0.5em 2em">0.5em 2em</Button>
    </Container>
  ))

storiesOf('General/Splash', module).add('Active', () => (
  <Splash visible={true}>
    <h1>Hello</h1>
  </Splash>
))

storiesOf('Search/SearchBar', module)
  .add('Normal', () => (
    <Container maxWidth="100%">
      <SearchBar />
    </Container>
  ))
  .add('With background', () => (
    <Hero className="hero-primary">
      <Container maxWidth="800px">
        <SearchBar />
      </Container>
    </Hero>
  ))

storiesOf('Search/Results amount', module).add('Normal', () => <ResultsAmount amount={50} />)

storiesOf('Search/Search sorting', module).add('Normal', () => (
  <Container maxWidth="500px">
    <SortResults />
  </Container>
))

storiesOf('Search/Result item', module).add('Normal', () => (
  <Container maxWidth="700px">
    <ListItem catId={EsRes.hits.hits[0]._id} item={EsRes.hits.hits[0]._source} lang="fi" />
  </Container>
))

storiesOf('Search/Pagination', module).add('Examples', () => (
  <div>
    <Pagination totalResults={50} perPage={10} currentPage={3} />
    <Pagination totalResults={60} perPage={3} currentPage={10} />
    <Pagination totalResults={100} perPage={3} currentPage={3} />
  </div>
))

storiesOf('Error page', module)
  .add('Not found', () => <ErrorPage error={{ type: 'notfound' }} />)
  .add('Error', () => <ErrorPage error={{ type: 'error' }} />)

storiesOf('Dataset/Identifier Component', module).add('Normal', () => (
  <Identifier idn={MetaxRes.research_dataset.preferred_identifier} />
))

storiesOf('General/Access rights', module).add('Open Access', () => (
  <div>
    <AccessRights access_rights={MetaxRes.research_dataset.access_rights} />
    <br />
    <AccessRights access_rights={{ access_type: { identifier: 'locked' } }} />
  </div>
))

storiesOf('Footer', module).add('Normal', () => <Footer />)

storiesOf('General/Loader', module).add('Normal', () => (
  <Fragment>
    <Container>
      <Loader active={true} />
    </Container>
    <Hero className="hero-primary">
      <Loader active={true} color="white" />
    </Hero>
  </Fragment>
))

storiesOf('General/Separator', module).add('Normal', () => <Separator />)

storiesOf('General/Skip to Content', module).add('Normal', () => (
  <div>
    <SkipToContent />
    <p>Press tab to see skipToContent</p>
  </div>
))

storiesOf('Dataset/Version changer', module)
  .add('Current Version', () => {
    const customVersionSet = [
      {
        identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9613',
        preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9613',
        removed: false,
        date_created: '2017-05-23T13:07:22+03:00',
      },
      {
        identifier: 'customID',
        preferred_identifier: 'customPid',
        removed: false,
        date_created: '2017-05-23T13:07:22+04:00',
      },
      {
        identifier: 'customID1',
        preferred_identifier: 'customPid1',
        removed: false,
        date_created: '2017-05-23T13:07:22+05:00',
      },
      {
        identifier: 'customID2',
        preferred_identifier: 'customPid2',
        removed: true,
        date_created: '2017-05-23T13:07:22+06:00',
      },
    ]
    return <VersionChanger versionSet={customVersionSet} idn={MetaxRes.identifier} />
  })
  .add('Old Version', () => {
    const customVersionSet = [
      {
        identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9613',
        preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9613',
        removed: false,
        date_created: '2017-05-23T13:07:22+03:00',
      },
      {
        identifier: 'customID',
        preferred_identifier: 'customPid',
        removed: false,
        date_created: '2017-05-23T13:07:22+04:00',
      },
      {
        identifier: 'customID1',
        preferred_identifier: 'customPid1',
        removed: false,
        date_created: '2017-05-23T13:07:22+05:00',
      },
      {
        identifier: 'customID2',
        preferred_identifier: 'customPid2',
        removed: true,
        date_created: '2017-05-23T13:07:22+06:00',
      },
    ]
    return <VersionChanger versionSet={customVersionSet} idn={'customID'} />
  })
  .add('Deleted Version', () => {
    const customVersionSet = [
      {
        identifier: 'cr955e904-e3dd-4d7e-99f1-3fed446f9613',
        preferred_identifier: 'urn:nbn:fi:att:1955e904-e3dd-4d7e-99f1-3fed446f9613',
        removed: false,
        date_created: '2017-05-23T13:07:22+03:00',
      },
      {
        identifier: 'customID',
        preferred_identifier: 'customPid',
        removed: false,
        date_created: '2017-05-23T13:07:22+04:00',
      },
      {
        identifier: 'customID1',
        preferred_identifier: 'customPid1',
        removed: false,
        date_created: '2017-05-23T13:07:22+05:00',
      },
      {
        identifier: 'customID2',
        preferred_identifier: 'customPid2',
        removed: true,
        date_created: '2017-05-23T13:07:22+06:00',
      },
    ]
    return <VersionChanger versionSet={customVersionSet} idn={'customID2'} />
  })

storiesOf('Dataset/Tabs', module).add('Normal', () => (
  <Tabs showDownloads={true} showEvents={true} identifier={'id'} />
))
