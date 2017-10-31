import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo'
import Identifier from '../js/components/identifier'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('Identifier', module)
  .add('URN', () => <Identifier idn='urn:my:urn' classes="btn btn-primary">Data location</Identifier>)
  .add('Http', () => <Identifier idn='http://dx.doi.org/urn:something'>Im the identifier</Identifier>)