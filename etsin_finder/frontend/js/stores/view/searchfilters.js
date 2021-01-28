/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, makeObservable } from 'mobx'

class SearchFilters {
  constructor() {
    makeObservable(this)
  }

  @observable fieldOfScienceIsOpen = false

  @observable keywordIsOpen = false

  @observable projectIsOpen = false

  @action toggleFieldOfScience = () => {
    this.fieldOfScienceIsOpen = !this.fieldOfScienceIsOpen
  }

  @action toggleKeyword = () => {
    this.keywordIsOpen = !this.keywordIsOpen
  }

  @action toggleProject = () => {
    this.projectIsOpen = !this.projectIsOpen
  }

  @action closeFilters = () => {
    this.fieldOfScienceIsOpen = false
    this.keywordIsOpen = false
    this.projectIsOpen = false
  }
}

export default SearchFilters
