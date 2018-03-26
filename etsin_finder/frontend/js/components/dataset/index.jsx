import React from 'react'
import PropTypes from 'prop-types'
import translate from 'counterpart'
import Translate from 'react-translate-component'

import DatasetQuery from 'Stores/view/datasetquery'
import Sidebar from './sidebar'
import Content from './content'
import ErrorPage from '../errorpage'
import ErrorBoundary from '../general/errorBoundary'
import NoticeBar from '../general/noticeBar'

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: DatasetQuery.results,
      email_info: DatasetQuery.email_info,
      error: false,
      live: true,
      identifier: props.match.params.identifier,
    }

    this.query = this.query.bind(this)
    this.updateData = this.updateData.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount() {
    this.query()
  }

  componentWillReceiveProps(newProps) {
    if (this.props.match.params.identifier !== newProps.match.params.identifier) {
      this.query(newProps.match.params.identifier)
    }
  }

  query(customId) {
    let identifier = this.props.match.params.identifier
    if (customId !== undefined) {
      identifier = customId
    }
    if (process.env.NODE_ENV === 'production' && /^\d+$/.test(identifier)) {
      console.log('Using integer as identifier not permitted')
      this.setState({ error: 'wrong identifier', loaded: true })
      return
    }
    DatasetQuery.getData(identifier)
      .then(result => {
        // TODO: The code below needs to be revised
        // TODO: Somewhere we need to think how 1) harvested, 2) accumulative, 3) deprecated, 4) removed, 5) ordinary
        // TODO: datasets are rendered. Maybe not here?
        if (result.harvested) {
          console.log('It seems the dataset is deprecated...')
          this.updateData(false, result)
        } else {
          this.updateData(true, result)
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({ error })
      })
  }

  updateData(isLive, res) {
    const researchDataset = res.catalog_record.research_dataset
    const hasFiles = researchDataset.directories || researchDataset.files

    this.setState({
      identifier: this.props.match.params.identifier,
      dataset: res.catalog_record,
      email_info: res.email_info,
      hasFiles,
      live: isLive,
      loaded: true,
    })
  }

  prevDataset() {
    let path = this.props.location.pathname.slice(1)
    path = path.split('/')
    const id = parseInt(this.props.match.params.identifier, 10) - 1
    this.setState(
      {
        loaded: false,
      },
      () => {
        if (path[2]) {
          this.props.history.push(`/dataset/${id}/${path[2]}`)
        } else {
          this.props.history.push(`/dataset/${id}`)
        }
      }
    )
  }

  nextDataset() {
    let path = this.props.location.pathname.slice(1)
    path = path.split('/')
    const id = parseInt(this.props.match.params.identifier, 10) + 1
    this.setState(
      {
        loaded: false,
      },
      () => {
        if (path[2]) {
          this.props.history.push(`/dataset/${id}/${path[2]}`)
        } else {
          this.props.history.push(`/dataset/${id}`)
        }
      }
    )
  }

  // goes back to previous page, which might be outside
  goBack() {
    this.props.history.goBack()
  }

  render() {
    // CASE 1: Houston, we have a problem
    if (this.state.error !== false) {
      return <ErrorPage error="notfound" />
    }

    // CASE 2: Business as usual
    return this.state.loaded ? (
      <div>
        {!this.state.live && <NoticeBar deprecated={translate('tombstone.info')} />}
        {!this.state.live && <NoticeBar cumulative="This is a cumulative dataset" />}
        <div className="container regular-row">
          <button onClick={() => this.prevDataset()}>Prev</button>
          <button onClick={() => this.nextDataset()}>Next</button>
          {console.log('rerender')}
          <button className="btn btn-transparent nopadding btn-back" onClick={this.goBack}>
            <span aria-hidden>{'< '}</span>
            <Translate content={'dataset.goBack'} />
          </button>
          <div className="row">
            <Content
              identifier={this.state.identifier}
              dataset={this.state.dataset}
              live={this.state.live}
              hasFiles={this.state.hasFiles}
              emails={this.state.email_info}
            />
            <div className="col-lg-4">
              <ErrorBoundary>
                <Sidebar dataset={this.state.dataset} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    ) : (
      'loading'
    )
  }
}

Dataset.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default Dataset
export const undecorated = Dataset
