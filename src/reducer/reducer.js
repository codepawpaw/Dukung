import { combineReducers } from "redux";

import selected_pendukung_reducer from './selected_pendukung_reducer'
import users_reducer from './users_reducer'

class Reducer {
  static all() {
    return combineReducers({
        selected_pendukung: selected_pendukung_reducer.reduce,
        users: users_reducer.reduce,
    });
  }
}
export default Reducer;