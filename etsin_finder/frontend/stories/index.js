import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import SampleData from './sampledata';
import DsDownloads from '../js/components/dsDownloads'; 
import { Button, Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('DsDownloads', module)
  .add('basic', () => (
    <SampleData url='https://metax-test.csc.fi/rest/datasets/pid:urn:cr1.json' >
      {dataset => 
        <DsDownloads files={dataset} />
      }
    </SampleData>
  ));