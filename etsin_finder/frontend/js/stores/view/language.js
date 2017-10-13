import { autorun, observable } from 'mobx';
import counterpart from 'counterpart';

class locale {
  @observable current_lang = counterpart.getLocale();
}

export default new locale();