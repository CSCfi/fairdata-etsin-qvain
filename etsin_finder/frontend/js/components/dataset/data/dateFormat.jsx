import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Locale from '../../../stores/view/language'

@observer
export default class DateFormat extends Component {
  constructor(props) {
    super(props)
    this.state =
    {
      fi: { lang: 'fi-FI', options: { year: 'numeric', month: 'numeric', day: 'numeric' } },
      en: { lang: 'en-US', options: { year: 'numeric', month: 'long', day: 'numeric' } },
    }
  }

  render() {
    return (
      <span>
        {new Date(this.props.date).toLocaleDateString(
          this.state[Locale.currentLang].lang,
          this.state[Locale.currentLang].options,
        )}
      </span>
    );
  }
}
