import React, { useMemo, useState, useEffect } from 'react'
import { shallow, mount } from 'enzyme'
import { ThemeProvider } from 'styled-components'
import axios from 'axios'
import { reaction, autorun, action, makeObservable, observable, runInAction, Reaction } from 'mobx'
import { useObserver, observer, Observer } from 'mobx-react'

import '../locale/translations'

import etsinTheme from '../js/styles/theme'
import PasState from '../js/components/qvain/editor/pasState'
import DescriptionField from '../js/components/qvain/description/descriptionField'
import OtherIdentifierField from '../js/components/qvain/description/otherIdentifierField'
import FieldOfScienceField from '../js/components/qvain/description/fieldOfScienceField'
import KeywordsField from '../js/components/qvain/description/keywordsField'
import License from '../js/components/qvain/licenses/licenses'
import AccessType from '../js/components/qvain/licenses/accessType'
import Files from '../js/components/qvain/files'
import FileForm from '../js/components/qvain/files/legacy/fileForm'
import IDAFilePicker from '../js/components/qvain/files/legacy/idaFilePicker'
import QvainStoreClass, {
  Directory,
  File,
  AccessType as AccessTypeConstructor,
  License as LicenseConstructor,
} from '../js/stores/view/qvain'
import LocaleStore from '../js/stores/view/language'
import EnvStore from '../js/stores/domain/env'
import { ACCESS_TYPE_URL, DATA_CATALOG_IDENTIFIER } from '../js/utils/constants'
import { StoresProvider, useStores } from '../js/stores/stores'

global.Promise = require('bluebird')

Promise.config({
  cancellation: true,
})

const observö = baseComponent => {
  return props => {
    const [tick, setTick] = useState(0)
    const _tick = () => {
      setTick(tick + 1)
    }

    const r = useMemo(() => new Reaction('reaktion_nimi', _tick), [])

    let rendering
    r.track(() => {
      rendering = baseComponent({ ...props })
    })
    return rendering
  }
}

const mockServer = observö

jest.mock('mobx-react', () => {
  const { useMemo, useState } = require('react')
  const { Reaction } = require('mobx')

  const observer = baseComponent => {
    return props => {
      const [tick, setTick] = useState(0) // dummy state for triggering update
      const _tick = () => {
        setTick(tick + 1)
      }

      const r = useMemo(() => new Reaction('reaktion_nimi', _tick), [])

      let rendering
      r.track(() => {
        rendering = baseComponent({ ...props })
      })
      return rendering
    }
  }

  return {
    ...jest.requireActual('mobx-react'),
    observer,
  }
})

// Unmount mounted components after each test to avoid tests affecting each other.
let wrapper
afterEach(() => {
  if (wrapper && wrapper.unmount && wrapper.length === 1) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('Mobx', () => {
  it('zzx', async () => {
    class Störge {
      constructor() {
        makeObservable(this)
      }

      @observable moro = 'jeejee'

      @action setMoro = val => {
        this.moro = val
      }
    }

    const störge = new Störge()

    const Jee = observer(() => {
      return <div>{störge.moro}</div>
    })

    autorun(() => {
      // console.log('reaktio:', störge.moro)
      // wrapper = shallow(<Jee />)
      // console.log(wrapper.debug())
    })

    console.log(Jee)

    wrapper = shallow(<Jee />)
    console.log(wrapper.debug())

    störge.setMoro('hei vaan')
    // wrapper = shallow(<Jee />)
    wrapper.setProps({})
    wrapper.update()

    console.log(wrapper.debug())
  })
})
