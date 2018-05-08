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
import Identifier from '../js/components/dataset/identifier'
import AccessRights from '../js/components/dataset/accessRights'
import Footer from '../js/layout/footer'
import Loader from '../js/components/general/loader'
import Separator from '../js/components/general/separator'
import SkipToContent from '../js/components/general/skipToContent'
import VersionChanger from '../js/components/dataset/versionChanger'
import Tabs from '../js/components/dataset/tabs'
import ComponentCode from '../js/components/general/componentCode'
import ContactForm from '../js/components/dataset/contact/contactForm'
import TableItem from '../js/components/dataset/data/tableItem'
import Table from '../js/components/dataset/data/table'
import ExternalResources from '../js/components/dataset/data/externalResources'

import EsRes from './esRes'
import MetaxRes, { MetaxRemote } from './metaxRes'
import idaDataTree, { remoteObj } from './resourceData'

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

const align = props => ({
  margin: props.center ? '0 auto' : '',
})

const Container = styled.div`
  width: 100%;
  max-width: ${props => (props.maxWidth ? props.maxWidth : '100%')};
  padding: 1em;
  ${align};
`

storiesOf('General/Hero', module).add('Normal', () => (
  <Hero className="hero-primary">
    <h1>Basic Hero</h1>
  </Hero>
))

storiesOf('General/Button', module)
  .add('Primary buttons', () => (
    <Container>
      <ComponentCode displayName={() => 'Button'}>
        <Button>Primary</Button>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'InvertedButton'}>
        <InvertedButton>Inverted</InvertedButton>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'Link'}>
        <Link href="https://google.com">Link</Link>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'TransparentButton'}>
        <TransparentButton>Transparent Button</TransparentButton>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'LinkButton'}>
        <LinkButton>LinkButton</LinkButton>
      </ComponentCode>
    </Container>
  ))
  .add('Color error', () => (
    <Container>
      <ComponentCode displayName={() => 'Button'}>
        <Button color={theme.color.error}>Primary</Button>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'InvertedButton'}>
        <InvertedButton color={theme.color.error}>Inverted</InvertedButton>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'Link'}>
        <Link href="https://google.com" color={theme.color.error}>
          Link
        </Link>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'TransparentButton'}>
        <TransparentButton color={theme.color.error}>Transparent Button</TransparentButton>
      </ComponentCode>
      <Separator />
      <ComponentCode displayName={() => 'LinkButton'}>
        <LinkButton color={theme.color.error}>LinkButton</LinkButton>
      </ComponentCode>
    </Container>
  ))
  .add('Custom', () => (
    <Container>
      <p>No Margin</p>
      <ComponentCode displayName={() => 'Button'}>
        <Button noMargin>Button</Button>
      </ComponentCode>
      <Separator />
      <p>Custom margin</p>
      <ComponentCode displayName={() => 'Button'}>
        <Button margin="1em 2em">Button</Button>
      </ComponentCode>
      <Separator />
      <p>No Padding</p>
      <ComponentCode displayName={() => 'TransparentButton'}>
        <TransparentButton noPadding>Click me!</TransparentButton>
      </ComponentCode>
      <Separator />
      <p>Custom padding</p>
      <ComponentCode displayName={() => 'Button'}>
        <Button padding="0.5em 2em">0.5em 2em</Button>
      </ComponentCode>
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
      <ComponentCode displayName={() => 'SearchBar'}>
        <SearchBar />
      </ComponentCode>
    </Container>
  ))
  .add('With background', () => (
    <Hero className="hero-primary">
      <Container maxWidth="800px">
        <SearchBar />
      </Container>
    </Hero>
  ))

storiesOf('Search/Results amount', module).add('Normal', () => (
  <ComponentCode displayName={() => 'ResultsAmount'}>
    <ResultsAmount amount={50} />
  </ComponentCode>
))

storiesOf('Search/Search sorting', module).add('Normal', () => (
  <Container maxWidth="500px">
    <ComponentCode displayName={() => 'SortResults'}>
      <SortResults />
    </ComponentCode>
  </Container>
))

storiesOf('Search/Result item', module).add('Normal', () => (
  <Container maxWidth="700px">
    <ComponentCode displayName={() => 'ListItem'} filterProps={['catId', 'item']}>
      <ListItem catId={EsRes.hits.hits[0]._id} item={EsRes.hits.hits[0]._source} lang="fi" />
    </ComponentCode>
  </Container>
))

storiesOf('Search/Pagination', module).add('Examples', () => (
  <div>
    <ComponentCode displayName={() => 'Pagination'}>
      <Pagination totalResults={50} perPage={10} currentPage={3} />
    </ComponentCode>
    <Separator />
    <ComponentCode displayName={() => 'Pagination'}>
      <Pagination totalResults={60} perPage={3} currentPage={10} />
    </ComponentCode>
    <Separator />
    <ComponentCode displayName={() => 'Pagination'}>
      <Pagination totalResults={100} perPage={3} currentPage={3} />
    </ComponentCode>
  </div>
))

storiesOf('Error page', module)
  .add('Not found', () => <ErrorPage error={{ type: 'notfound' }} />)
  .add('Error', () => <ErrorPage error={{ type: 'error' }} />)

storiesOf('Dataset/Identifier Component', module).add('Normal', () => (
  <ComponentCode displayName={() => 'Identifier'}>
    <Identifier idn={MetaxRes.research_dataset.preferred_identifier} />
  </ComponentCode>
))

storiesOf('General/Access rights', module).add('Open Access', () => (
  <div>
    <ComponentCode displayName={() => 'AccessRights'}>
      <AccessRights access_rights={MetaxRes.research_dataset.access_rights} />
    </ComponentCode>
    <ComponentCode displayName={() => 'AccessRights'}>
      <AccessRights
        access_rights={{
          access_type: {
            identifier: 'locked',
            pref_label: {
              en: 'locked',
              fi: 'suljettu',
            },
          },
        }}
      />
    </ComponentCode>
  </div>
))

storiesOf('Footer', module).add('Normal', () => <Footer />)

storiesOf('General/Loader', module).add('Normal', () => (
  <Fragment>
    <Container>
      <ComponentCode displayName={() => 'Loader'}>
        <Loader active={true} />
      </ComponentCode>
    </Container>
    <Separator />
    <Hero className="hero-primary">
      <Loader active={true} color="white" />
    </Hero>
  </Fragment>
))

storiesOf('General/Separator', module).add('Normal', () => (
  <ComponentCode displayName={() => 'Separator'}>
    <Separator />
  </ComponentCode>
))

storiesOf('General/Skip to Content', module).add('Normal', () => (
  <div>
    <ComponentCode displayName={() => 'SkipToContent'}>
      <SkipToContent />
    </ComponentCode>
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
    return (
      <ComponentCode displayName={() => 'VersionChanger'} filterProps={['versionSet']}>
        <VersionChanger versionSet={customVersionSet} idn={MetaxRes.identifier} />
      </ComponentCode>
    )
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
    return (
      <ComponentCode displayName={() => 'VersionChanger'} filterProps={['versionSet']}>
        <VersionChanger versionSet={customVersionSet} idn={'customID'} />
      </ComponentCode>
    )
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
    return (
      <ComponentCode displayName={() => 'VersionChanger'} filterProps={['versionSet']}>
        <VersionChanger versionSet={customVersionSet} idn={'customID2'} />
      </ComponentCode>
    )
  })

storiesOf('Dataset/Tabs', module).add('Normal', () => (
  <ComponentCode>
    <Tabs showDownloads={true} showEvents={true} identifier={'id'} />
  </ComponentCode>
))

storiesOf('Dataset/Contact', module).add('Normal', () => {
  const translations = {
    contact: 'Contact',
    email: {
      error: { required: 'Email is required!', invalid: 'Invalid email address' },
      name: 'Email',
      placeholder: 'Enter your email',
    },
    error: 'Error sending message!',
    errorInternal: 'Internal server error! Please contact our support',
    message: {
      error: { required: 'Message is required!', max: 'Maximum message length is 1000 characters' },
      name: 'Message',
      placeholder: 'Enter your message',
    },
    recipient: {
      error: { required: 'Recipient is required!' },
      placeholder: 'Select recipient',
      name: 'Recipient',
    },
    send: 'Send message',
    subject: {
      error: { required: 'Subject is required!' },
      name: 'Subject',
      placeholder: 'Enter your subject',
    },
    success: 'Successfully sent message!',
  }
  const recipients = [
    { label: 'Publisher', value: 'PUBLISHER' },
    { label: 'Contributor', value: 'CONTRIBUTOR' },
    { label: 'Rights Holder', value: 'RIGHTS_HOLDER' },
  ]
  return (
    <Container maxWidth="1000px" center>
      <ContactForm
        close={() => console.log('close')}
        datasetID={'id'}
        recipientsList={recipients}
        translations={translations}
      />
    </Container>
  )
})

const parseIda = ida => {
  let parsed = {}
  if (ida.type === 'dir') {
    parsed.type = ida.type
    parsed.name = ida.name
    parsed.file_count = ida.details.file_count
    parsed.byte_size = ida.details.byte_size
    parsed.identifier = ida.identifier
    parsed.category = ida.use_category.pref_label
    parsed.description = ida.description
  } else {
    parsed.type = ida.type
    parsed.name = ida.name
    parsed.byte_size = ida.details.byte_size
    parsed.identifier = ida.identifier
    parsed.category = ida.use_category.pref_label
    parsed.description = ida.description
  }
  return parsed
}

storiesOf('Dataset/Data/TableItem', module).add('Normal', () => {
  const parseExternal = ext => {
    // let parsed = {
    //   type: ext.file_type.pref_label,
    //   name: ext.title,
    //   byte_size: ext.byte_size,
    //   identifier: ext.identifier,
    //   category: ext.use_category.pref_label,
    //   description: ext.description,
    // }
    console.log(ext)
    // return parsed
  }

  const item1 = parseIda(idaDataTree[1])
  const item2 = parseIda(idaDataTree[2])
  const remote1 = parseExternal(remoteObj)

  // type: PropTypes.string,
  //   name: PropTypes.string.isRequired,
  //   file_count: PropTypes.number,
  //   byte_size: PropTypes.number,
  //   identifier: PropTypes.string.isRequired,
  //   category: PropTypes.shape({
  //     pref_label: PropTypes.object,
  //   }),
  //   description: PropTypes.string,

  return (
    <Container center maxWidth="800px">
      <table style={{ width: '100%' }}>
        <tbody>
          <TableItem
            item={item1}
            index={1}
            changeFolder={() => console.log('change folder')}
            access={true}
            fields={{ size: true, category: true, name: true, downloadBtn: true, infoBtn: true }}
          />
          <TableItem
            item={item2}
            index={2}
            changeFolder={() => console.log('change folder')}
            access={true}
            fields={{ size: true, category: true, name: true, downloadBtn: true, infoBtn: true }}
          />
          {/* <TableItem
            item={remote1}
            index={3}
            changeFolder={() => console.log('change folder')}
            access={true}
          /> */}
        </tbody>
      </table>
    </Container>
  )
})

storiesOf('Dataset/Data/Table', module).add('Normal', () => {
  const folder = idaDataTree.map(single => parseIda(single))
  return (
    <Table
      access
      data={folder}
      changeFolder={() => console.log('change folder')}
      fields={{ size: true, category: true, name: true, downloadBtn: true, infoBtn: true }}
    />
  )
})

storiesOf('Dataset/Data/Remote', module).add('Normal', () => (
  <ExternalResources results={MetaxRemote} />
))
