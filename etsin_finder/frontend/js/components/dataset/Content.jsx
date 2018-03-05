import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Button from '../general/button'
import DateFormat from './data/dateFormat'
import AccessRights from './data/accessRights'
import checkNested from '../../utils/checkNested'
import ErrorBoundary from '../general/errorBoundary'
import Person from './person'
import Contact from './contact'

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

class Content extends Component {
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
          <h1>{this.props.title}</h1>
        </div>
        <div className="d-flex justify-content-between basic-info">
          <div>
            <ErrorBoundary>
              <Person creator={this.props.creator} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Person contributor={this.props.contributor} />
            </ErrorBoundary>
          </div>
          <p>{this.props.issued ? <DateFormat date={this.props.issued} /> : null}</p>
        </div>
        <p className="description">{this.props.children}</p>
        <Contact />
      </div>
    )
  }
}

export default withTheme(Content)
