class Tracking {
  isActive() {
    return true
    // return process.env.MATOMO === 'true'
  }

  newPageView(title, location) {
    if (this.isActive) {
      _paq.push(['setCustomUrl', location]);
      _paq.push(['setDocumentTitle', title]);
      _paq.push(['trackPageView']);
    }
  }
}

export default new Tracking()
