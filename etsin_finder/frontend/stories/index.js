import React, { Fragment } from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import Button, {
  InvertedButton,
  Link,
  TransparentButton,
  LinkButton,
} from '../js/components/general/button'
import Splash from '../js/components/general/splash'
import Pagination from '../js/components/search/pagination'
import theme from '../js/theme'

storiesOf('Welcome', module).add('welcome', () => (
  <div>
    <p>Click through components</p>
  </div>
))

storiesOf('Button', module).add('Primary buttons', () => (
  <Fragment>
    <Button theme={theme}>Primary</Button>
    <InvertedButton theme={theme}>Inverted</InvertedButton>
    <Link href="https://google.com" theme={theme}>
      Link
    </Link>
    <TransparentButton theme={theme}>Transparent Button</TransparentButton>
    <LinkButton theme={theme}>LinkButton</LinkButton>
  </Fragment>
))

storiesOf('Splash', module).add('Active', () => (
  <Splash theme={theme} visible="true">
    <h1>Hello</h1>
  </Splash>
))

storiesOf('Pagination', module).add('5 pages', () => <Pagination />)
