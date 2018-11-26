import { combineReducers } from "redux";

import SelectedPendukungReducer from './SelectedPendukungReducer'
import UsersReducer from './UsersReducer'

class Reducer {
  static all() {
    return combineReducers({
        selected_pendukung: SelectedPendukungReducer.reduce,
        users: UsersReducer.reduce,
    });
  }
}
export default Reducer;