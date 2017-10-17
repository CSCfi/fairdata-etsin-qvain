import { observable } from 'mobx';
import counterpart from 'counterpart';

class Locale {
  @observable currentLang = counterpart.getLocale();
}

export default new Locale();
