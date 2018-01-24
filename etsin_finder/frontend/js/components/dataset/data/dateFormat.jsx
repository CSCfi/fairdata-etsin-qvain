import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Locale from '../../../stores/view/language'

@observer
export default class DateFormat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fi: {
        lang: 'fi-FI',
        options: { day: 'numeric', month: 'numeric', year: 'numeric' },
      },
      en: {
        lang: 'en-US',
        options: { year: 'numeric', month: 'long', day: 'numeric' },
      },
    }
  }

  makeDate() {
    if (Locale.currentLang === 'en') {
      return new Date(this.props.date).toLocaleDateString(
        this.state[Locale.currentLang].lang,
        this.state[Locale.currentLang].options
      )
    }
    const itemDate = new Date(this.props.date)
    const day = itemDate.getDate()
    const month = itemDate.getMonth()
    const year = itemDate.getFullYear()
    const finnishFormat = `${day}.${month + 1}.${year}`
    return finnishFormat
  }

  render() {
    return <span>{this.makeDate()}</span>
  }
}
