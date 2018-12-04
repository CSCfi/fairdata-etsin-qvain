/* eslint-disable no-undef */
class Tracking {
  isActive() {
    // check if Matomo is active, will return false in development
    return typeof _paq === 'object'
  }

  newPageView(title, location) {
    if (this.isActive()) {
      _paq.push(['setCustomUrl', location])
      _paq.push(['setDocumentTitle', title])
      _paq.push(['trackPageView'])
    }
  }

  newSearch(keyword, category, resultsAmount) {
    if (this.isActive()) {
      _paq.push(['trackSiteSearch', keyword, false, resultsAmount])
    }
  }
}

export default new Tracking()
