import React from "react";
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle";

class HeaderLinks extends React.Component {
  state = {
    open: false
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  editPassword = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    window.location.pathname = "/editProfile";
  }

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    sessionStorage.removeItem("key");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("admin");
    window.location.pathname = '/';

    this.setState({ open: false });
  };

  handleCloseAway = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    if(sessionStorage.getItem("key") === null) {
      return null;
    }

    return (
      <div>
        <div className={classes.manager}>
          <Poppers
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseAway}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleClose}
                        className={classes.dropdownItem}
                      >
                           Logout     
                      </MenuItem>
                      <MenuItem
                        onClick={this.editPassword}
                        className={classes.dropdownItem}
                      >
                           Edit Password     
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={open ? "menu-list-grow" : null}
          aria-label="Person"
          onClick={this.handleToggle}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
              <p onClick={this.handleClick} className={classes.linkText}>
                Profile
              </p>
          </Hidden>
        </Button>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);
