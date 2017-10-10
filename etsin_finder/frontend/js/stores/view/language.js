import { autorun, observable } from 'mobx';
import translations from '../../../locale/data.js';

class LocaleStore {
  @observable language = "en_US";
  @observable langShort = "en";
  @observable messages = "";
}

const Locale = window.Locale = new LocaleStore();
console.log(Locale);
export default Locale;

let localeData = translations();
autorun(() => {
  console.log("updating language");
  Locale.langShort = Locale.language.toLowerCase().split(/[_-]+/)[0];
  Locale.messages = localeData[Locale.langShort] || localeData[Locale.language] || localeData.en;
})