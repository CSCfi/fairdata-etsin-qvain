{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
// import axios from 'axios'

import sizeParse from '../../../utils/sizeParse'
import { InvertedButton } from '../../general/button'

export default class TableHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadAllUrl: '',
      downloadDisabled: false,
    }
    this.downloadAllRef = React.createRef()
  }

  downloadAll = () => {
    this.setState(
      {
        downloadAllUrl: `/api/dl?cr_id=${this.props.crId}`,
        downloadDisabled: true,
      },
      () => {
        this.downloadAllRef.current.click()
      }
    )
  }
  render() {
    return (
      <Header>
        <div>
          <TableTitle>
            <Translate content={`dataset.dl.${this.props.title}`} />
          </TableTitle>
          <ObjectCount>
            <Translate
              component="span"
              content="dataset.dl.fileAmount"
              with={{ amount: this.props.objectCount }}
            />
            {this.props.totalSize !== 0 && ` (${sizeParse(this.props.totalSize, 1)})`}
          </ObjectCount>
        </div>
        {this.props.downloadAll && !this.state.downloadDisabled && (
          <ButtonsCont>
            <InvertedButton
              color="white"
              disabled={!this.props.allowDownload}
              onClick={() => this.downloadAll()}
            >
              <Translate content="dataset.dl.downloadAll" />
              <Translate className="sr-only" content="dataset.dl.file_types.both" />
            </InvertedButton>
          </ButtonsCont>
        )}
        {this.state.downloadDisabled && (
          <ButtonsCont>
            <InvertedButton
              color="white"
              disabled
            >
              <Translate content="dataset.dl.downloading" />
              <Translate className="sr-only" content="dataset.dl.file_types.both" />
            </InvertedButton>
          </ButtonsCont>

        )}
        {this.state.downloadAllUrl && (
          <HiddenLink href={this.state.downloadAllUrl} ref={this.downloadAllRef} download />
        )}
      </Header>
    )
  }
}

const Header = styled.div`
  background-color: ${p => p.theme.color.primary};
  padding: 1em 1.5em;
  color: white;
  display: flex;
  justify-content: space-between;
`

const ButtonsCont = styled.div`
  display: flex;
  align-items: center;
`

const TableTitle = styled.h4`
  margin-bottom: 0;
`

const ObjectCount = styled.p`
  margin-bottom: 0;
`

const HiddenLink = styled.a`
  display: none;
  visibility: hidden;
`

TableHeader.defaultProps = {
  totalSize: 0,
  downloadAll: false,
  crId: '',
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  totalSize: PropTypes.number,
  objectCount: PropTypes.number.isRequired,
  crId: PropTypes.string,
  allowDownload: PropTypes.bool.isRequired,
  downloadAll: PropTypes.bool,
}
