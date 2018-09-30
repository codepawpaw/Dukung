import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import HeaderLinks from "./HeaderLinks";
import Button from "components/CustomButtons/Button";

import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import AddAlert from "@material-ui/icons/AddAlert";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    const user = JSON.parse(sessionStorage.getItem("user"));

    if(user !== null) {
      this.state = { openLoginNotification: true };
    } else {
      this.state = { openLoginNotification: false };
    }
  }

  makeBrand() {
      var name;
      this.props.routes.map((prop, key) => {
        if (prop.path === this.props.location.pathname) {
          name = prop.navbarName;
        }
        return null;
      });
      return name;
  }

  render() {
    const { classes, color } = this.props;
    const appBarClasses = classNames({
      [" " + classes[color]]: color
    });

    const user = JSON.parse(sessionStorage.getItem("user"));

    return (
      <AppBar className={classes.appBar + appBarClasses}>
            {
              user !== null ? (
                // <div>{user.username} as {user.tingkat}</div>
                <Snackbar
                  place="tl"
                  color="info"
                  icon={AddAlert}
                  message={"Login as " + user.username + " with " + user.tingkat + " position"}
                  open={this.state.openLoginNotification}
                  closeNotification={() => this.setState({ openLoginNotification: false })}
                  close={false}
                />
              ) : (
                <div/>
              )
            }
        <Toolbar className={classes.container}>
          <div className={classes.flex}>
            {/* Here we create navbar brand, based on route name */}
            <Button color="transparent" href="#" className={classes.title}>
              {this.makeBrand()}
            </Button>
          </div>
          <Hidden smDown implementation="css">
            <HeaderLinks />
          </Hidden>
          <Hidden mdUp implementation="css">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(headerStyle)(Header);
