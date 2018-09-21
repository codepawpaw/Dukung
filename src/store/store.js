import { createStore } from "redux";
import Reducer from "../reducer/reducer";

class Store {
  static create() {
    return createStore(Reducer.all(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  }
}
export default Store;