import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import translate from 'counterpart'
import Accessibility from 'Stores/view/accessibility'
import VersionSelect from '../general/versionselect'
// import Select from '../general/select'

// const VersionSelect = styled(Select)`
//   width: 10.5em;
//   margin-right: 1em;
//   margin-bottom: 0;
// `

class VersionChanger extends Component {
  constructor(props) {
    super(props)

    const versions = this.versionLabels(props.versionSet)

    this.state = {
      versions,
      selected: versions.filter(single => single.value === props.pid)[0],
    }
  }

  componentWillReceiveProps = () => {
    const versions = this.versionLabels(this.props.versionSet)
    this.setState({
      versions,
      selected: versions.filter(single => single.value === this.props.pid)[0],
    })
  }

  versionLabels = set =>
    set.map((single, i) => {
      const old = i > 0 ? translate('dataset.version.old') : ''
      return {
        label: `${translate('dataset.version.number', { number: set.length - i })} ${old}`,
        value: single.preferred_identifier,
      }
    })

  changeVersion = (name, value) => {
    this.setState(
      {
        selected: value,
      },
      () => {
        this.props.history.push(`/dataset/${value.value}`)
        Accessibility.setNavText(`Navigated to ${value.label}`)
        console.log(Accessibility.navText)
      }
    )
  }

  closeModal = () => {
    console.log('close modal')
  }

  render() {
    return (
      <VersionSelect
        background="#FFBD39"
        newestColor="#00aa66"
        color="white"
        name="versions"
        padding="0.5em 1em"
        width="10em"
        value={this.state.selected}
        onChange={this.changeVersion}
        onBlur={this.closeModal}
        options={this.state.versions}
      />
    )
  }
}

VersionChanger.propTypes = {
  versionSet: PropTypes.array.isRequired,
  pid: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(VersionChanger)
