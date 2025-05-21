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

import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortAmountUp, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import Translate from '@/utils/Translate'
import { useQuery } from '@/components/etsin/general/useQuery'

import { InvertedButton } from '../../general/button'
import { useStores } from '@/stores/stores'

const RELEVANCE = 'best'
const DATE_D = '-modified'
const DATE_A = 'modified'

const options = [RELEVANCE, DATE_D, DATE_A]
const details = {
  [RELEVANCE]: {
    icon: faSort,
    title: 'search.sorting.bestTitle',
  },
  [DATE_D]: {
    icon: faSortAmountDown,
    title: 'search.sorting.dateD',
  },
  [DATE_A]: {
    icon: faSortAmountUp,
    title: 'search.sorting.dateA',
  },
}

function SortResults() {
  const [isOpen, setOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(RELEVANCE)
  const query = useQuery()
  const history = useHistory()
  const listToggle = isOpen ? 'open' : ''

  useEffect(() => {
    if (query.has('ordering')) {
      setSelectedOption(query.get('ordering'))
    }
  }, [query])

  const {
    Etsin: {
      Search: { isLoading },
    },
  } = useStores()

  const handleOrderingClick = item => {
    setSelectedOption(item)

    if (item !== RELEVANCE) {
      query.set('ordering', item)
    } else {
      query.delete('ordering')
    }
    setOpen(false)
    history.push(`/datasets?${query.toString()}`)
  }

  if (isLoading) return null

  return (
    <SortResultsContainer>
      <div>
        <SelectButton>
          <InvertedButton
            className={`btn-select ${listToggle} ${isOpen ? 'active' : ''}`}
            onClick={() => {
              setOpen(!isOpen)
            }}
            value={selectedOption}
            padding="0.5em 1em"
            noMargin
          >
            <FontAwesomeIcon icon={details[selectedOption].icon} aria-hidden="true" />{' '}
            <Translate content={details[selectedOption].title} />
          </InvertedButton>
        </SelectButton>
        <SelectOptionsContainer>
          <SelectOptions id="select-options" className={listToggle}>
            <div>
              {options.map(item => (
                <InvertedButton
                  key={`ordering-${item}`}
                  noMargin
                  padding="0.5em 1em"
                  className={`btn-select-options ${selectedOption === item ? 'active' : ''}`}
                  onClick={() => handleOrderingClick(item)}
                  value={item}
                  disabled={!isOpen}
                  aria-hidden={!isOpen}
                >
                  <Translate content={details[item].title} />
                </InvertedButton>
              ))}
            </div>
          </SelectOptions>
        </SelectOptionsContainer>
      </div>
    </SortResultsContainer>
  )
}

const SelectOptionsContainer = styled.div`
  position: relative;
`

const SelectOptions = styled.div`
  background-color: white;
  position: absolute;
  right: 0;
  z-index: 10;
  border: 0px solid ${props => props.theme.color.primary};
  border-radius: 5px;
  max-height: 0px;
  width: max-content;
  overflow: hidden;
  transition:
    max-height 0.5s ease,
    border 0.3s ease 0.4s;
  margin-top: 0.5em;
  & > div {
    display: flex;
    flex-direction: column;
  }
  &.open {
    transition:
      max-height 0.5s ease,
      border 0.3s ease;
    max-height: 150px;
    border: 2px solid ${props => props.theme.color.primary};
  }
  button {
    text-align: right;
    border-radius: 0;
    border: none;
    &:focus {
      text-decoration: underline;
    }
  }
`

const SelectButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: max-content;
  button {
    position: relative;
    &.open {
      border-radius: 5px;
      &::after {
        content: '';
        position: absolute;
        bottom: -0.5em;
        right: calc(50% - 0.5em);
        display: 'block';
        width: 0.5em;
        border-top: 0.5em solid ${props => props.theme.color.primary};
        border-left: 0.5em solid transparent;
        border-right: 0.5em solid transparent;
      }
      &:hover,
      &:focus {
        background-color: ${props => props.theme.color.primary};
      }
    }
  }
`

const SortResultsContainer = styled.div`
  float: right;
`

export default observer(SortResults)
