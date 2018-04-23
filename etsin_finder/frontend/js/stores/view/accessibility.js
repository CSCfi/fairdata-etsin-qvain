import { observable, action } from 'mobx'

class Accessibility {
  @observable navText = ''
  @observable userIsTabbing = false

  @action
  toggleTabbing(value) {
    if (value) {
      this.userIsTabbing = value
    } else {
      this.userIsTabbing = !this.userIsTabbing
    }
  }

  @action
  setNavText(text) {
    this.navText = text
  }

  @action
  clearNavText() {
    this.navText = ''
  }

  // don't show outline when user is not using tab to navigate
  @action
  handleTab = e => {
    if (e.keyCode === 9) {
      document.body.classList.add('user-is-tabbing')
      this.toggleTabbing(true)

      window.removeEventListener('keydown', this.handleTab)
      /* eslint-disable-next-line no-use-before-define */
      window.addEventListener('mousedown', this.handleMouseDownOnce)
    }
  }

  @action
  handleMouseDownOnce = () => {
    document.body.classList.remove('user-is-tabbing')
    this.toggleTabbing(false)
    window.removeEventListener('mousedown', this.handleMouseDownOnce)
    window.addEventListener('keydown', this.handleTab)
  }

  @action
  initialLoad = () => {
    window.addEventListener('keydown', this.handleTab)
  }
}

export default new Accessibility()
