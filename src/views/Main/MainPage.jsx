import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class MainPage extends React.Component {
  state = {
    value: 0
  };

  render() {
    //this.props.history.push("/login");
    return (
        <div/>
    ) 
  }
}

export default withStyles(dashboardStyle)(MainPage);