import { observable } from 'mobx'
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

class History {
  @observable history = history
  @observable location = history.location
}

export default new History();
