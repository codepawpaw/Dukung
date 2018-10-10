import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Snack from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import snackbarContentStyle from "assets/jss/material-dashboard-react/components/snackbarContentStyle.jsx";
import Button from "components/CustomButtons/Button.jsx";

class SnackbarWithConfirmation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, message, color, close, icon, place, open } = this.props;
    var action = [];
    const messageClasses = classNames({
      [classes.iconMessage]: icon !== undefined
    });

    if (close !== undefined) {
      action = [
        <IconButton
          className={classes.iconButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => this.props.closeNotification()}
        >
          <Close className={classes.close} />
        </IconButton>
      ];
    }
    return (
        <Snack
          anchorOrigin={{
            vertical: place.indexOf("t") === -1 ? "bottom" : "top",
            horizontal:
              place.indexOf("l") !== -1
                ? "left"
                : place.indexOf("c") !== -1 ? "center" : "right"
          }}
          open={open}
          message={
            <div>
              <span className={messageClasses}>{message}</span>
              <Button color="danger" onClick={this.props.deleteButton}>Yes</Button>
              <Button color="success" onClick={this.props.cancelButton}>No</Button>
            </div>
          }
          action={action}
          ContentProps={{
            classes: {
              root: classes.root + " " + classes[color],
              message: classes.message
            }
          }}
        />
      );
  }
}

SnackbarWithConfirmation.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.func,
  place: PropTypes.oneOf(["tl", "tr", "tc", "br", "bl", "bc"]),
  open: PropTypes.bool
};

export default withStyles(snackbarContentStyle)(SnackbarWithConfirmation);

