import { combineReducers } from "redux";

import users_reducer from './users_reducer'

class Reducer {
  static all() {
    return combineReducers({
        users_reducer: users_reducer.reduce,

    });
  }
}
export default Reducer;