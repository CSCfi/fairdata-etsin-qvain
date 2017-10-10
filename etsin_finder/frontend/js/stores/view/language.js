import { autorun, observable } from 'mobx';

class LocaleStore {
}

const Locale = window.Locale = new LocaleStore();
export default Locale;

autorun(() => {
})