import { observable } from 'mobx';
import counterpart from 'counterpart';

class Locale {
  @observable currentLang = counterpart.getLocale();
  setLang = (lang) => {
    counterpart.setLocale(lang)
    this.currentLang = counterpart.getLocale()
  }
  toggleLang = () => {
    const current = counterpart.getLocale();
    counterpart.setLocale((current === 'fi' ? 'en' : 'fi'))
    this.currentLang = counterpart.getLocale()
  }
}

export default new Locale();
