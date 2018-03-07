import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Button from '../general/button'
import DateFormat from './data/dateFormat'
import AccessRights from './data/accessRights'
import checkNested from '../../utils/checkNested'
import ErrorBoundary from '../general/errorBoundary'
import Person from './person'
import Contact from './contact'
import checkDataLang from '../../utils/checkDataLang'

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
`

const LabelButton = styled(Button)`
  margin: 0;
  margin-right: 0.5em;
  font-size: 0.9em;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

class Description extends Component {
  constructor(props) {
    super(props)

    console.log(props.dataset)
    const { creator, contributor, title, issued, description } = props.dataset.research_dataset
    console.log(description)
    this.state = {
      creator,
      contributor,
      title,
      issued,
      description,
    }
  }
  render() {
    return (
      <div className="dsContent">
        <Labels>
          <Flex>
            <LabelButton
              onClick={() => alert('Change version')}
              color={this.props.theme.color.yellow}
            >
              Versio 2 (Vanha)
            </LabelButton>
            <AccessRights
              access_rights={
                checkNested(this.props.dataset, 'access_rights', 'access_type')
                  ? this.props.dataset.access_rights
                  : null
              }
            />
          </Flex>
          <Button onClick={() => alert('Hae käyttölupaa')}>Hae käyttölupaa</Button>
        </Labels>
        <div className="d-md-flex align-items-center dataset-title justify-content-between">
          <h1>{checkDataLang(this.state.title)}</h1>
        </div>
        <div className="d-flex justify-content-between basic-info">
          <div>
            <ErrorBoundary>
              <Person creator={this.state.creator} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Person contributor={this.state.contributor} />
            </ErrorBoundary>
          </div>
          <p>{this.state.issued ? <DateFormat date={checkDataLang(this.state.issued)} /> : null}</p>
        </div>
        <ErrorBoundary>
          {/* currently displays only first description */}
          {/* {this.state.description.map(desc => <p className="description">{checkDataLang(desc)}</p>)} */}
          <p className="description">{checkDataLang(this.state.description[0])}</p>
        </ErrorBoundary>
        <Contact />
      </div>
    )
  }
}

export default withTheme(Description)
