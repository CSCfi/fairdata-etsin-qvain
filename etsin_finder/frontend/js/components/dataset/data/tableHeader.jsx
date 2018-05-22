import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
// import axios from 'axios'

import sizeParse from '../../../utils/sizeParse'
import { InvertedButton } from '../../general/button'

export default class TableHeader extends Component {
  downloadAll = () => {
    // if (this.props.access) {
    //   axios
    //     .get(`http://od.fairdata.fi/api/v1/dataset/${this.props.crId}`)
    //     .then(res => {
    //       console.log(res)
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
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
        {this.props.downloadAll && (
          <ButtonsCont>
            <InvertedButton
              color="white"
              disabled={!this.props.access}
              onClick={() => this.downloadAll()}
            >
              <Translate content="dataset.dl.downloadAll" />
              <Translate className="sr-only" content="dataset.dl.file_types.both" />
            </InvertedButton>
          </ButtonsCont>
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

TableHeader.defaultProps = {
  totalSize: 0,
  downloadAll: false,
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  totalSize: PropTypes.number,
  objectCount: PropTypes.number.isRequired,
  // crId: PropTypes.string.isRequired,
  access: PropTypes.bool.isRequired,
  downloadAll: PropTypes.bool,
}
