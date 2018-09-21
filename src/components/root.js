import React from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import Store from "../store/store.js";
import { Provider } from "react-redux";

import "assets/css/material-dashboard-react.css?v=1.4.1";

import indexRoutes from "routes/index.jsx";

const hist = createBrowserHistory();

export default class Root extends React.Component {
    constructor(){
      super();
      this.store = Store.create();
      global.store = this.store;
    }
  
    render() {
      return(
        <Provider store={ this.store }>
            <Router history={hist}>
                <Switch>
                {indexRoutes.map((prop, key) => {
                    return <Route path={prop.path} component={prop.component} key={key} />;
                })}
                </Switch>
            </Router>
        </Provider>
      );
    }
  }
