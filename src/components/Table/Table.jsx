import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableDetail from "./TableDetail.jsx";
// core components
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle";
import Button from "components/CustomButtons/Button.jsx";
import SelectedPendukungAction from "../../action/selected_pendukung_action";
import SnackbarWithConfirmation from "components/Snackbar/SnackbarWithConfirmation.jsx";

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showDeleteConfirmation: false, tc: false, selectedNik: "", selectedName: "" };
    this.deletePendukung = this.deletePendukung.bind(this);
    this.hideDeleteAlert = this.hideDeleteAlert.bind(this);
  }

  approvePendukung(nik) {
      fetch('http://128.199.101.218:8181/pemilu/confirmPendukung?nik='+nik, {
          method: 'GET',
          headers: {
            "token": sessionStorage.getItem("key")
          }
      })
      .then(response => {
          return response.json();
      })
      .then(dataResult => {
        window.location = "/daftar-dukungan";
      });
  }

  clearAlertTimeout() {
    if (this.alertTimeout !== null) {
      clearTimeout(this.alertTimeout);
    }
  }

  hideDeleteAlert() {
    this.setState({ tc: false });
  }

  showNotification(place) {
    var x = [];
    x[place] = true;
    this.setState(x);
    this.clearAlertTimeout();
    this.alertTimeout = setTimeout(
      function() {
        x[place] = false;
        this.setState(x);
      }.bind(this),
      9000
    );
  }

  clickDeleteButton(nik, name) {
      this.setState({ selectedNik: nik, selectedName: name });
      this.showNotification("tc");
  }

  deletePendukung() {
      var nik = this.state.selectedNik;
      console.log(nik);
      var formData = new FormData();
      fetch('http://128.199.101.218:8181/pemilu/deletePendukung?nik='+nik, {
          method: 'DELETE',
          body: formData,
          headers: {
            "token": sessionStorage.getItem("key")
          }
      })
      .then(response => {
          return response.json();
      })
      .then(dataResult => {
        console.log(dataResult);
        window.location = "/daftar-dukungan";
      });
  }

  deleteUser(userId) {
      fetch('http://128.199.101.218:8181/pemilu/deleteUser?id='+userId, {
          method: 'DELETE',
          headers: {
            "token": sessionStorage.getItem("key")
          }
      })
      .then(response => {
          return response.json();
      })
      .then(dataResult => {
        window.location = "/admin";
      });
  }

  viewDetailPendukung() {
    this.props.showSelectedPendukung("");
  }

  render() {
    const { classes, tableHead, tableData, tableHeaderColor } = this.props;
    const messageAlert = "Apakah kamu yakin akan menghapus "+ this.state.selectedName + " dari daftar pendukung ?"
    return (
      <div className={classes.tableResponsive}>
        <SnackbarWithConfirmation
          place="tc"
          color="primary"
          icon={AddAlert}
          message={messageAlert}
          open={this.state.tc}
          deleteButton={this.deletePendukung}
          cancelButton={this.hideDeleteAlert}
          closeNotification={() => this.setState({ tc: false })}
          close
        />
        <Table className={classes.table}>
          {tableHead !== undefined ? (
            <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
              <TableRow>
                {tableHead.map((prop, key) => {
                  return (
                    <TableCell
                      className={classes.tableCell + " " + classes.tableHeadCell}
                      key={key}
                    >
                      {prop}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {tableData.map((props2, key) => {
              var i = 0;

              return (
                <TableRow key={key}>
                  {
                  }
                  {props2.map((prop, key) => {
                    i++
                    if(this.props.withActionButton === true && i >= props2.length) {
                      return <Button onClick={this.deleteUser.bind(this, props2[3])} color="primary">Delete</Button>
                    } else if(this.props.withActionButtonDeletePendukung === true && i >= props2.length) {
                      return (
                        <div>
                          <Button onClick={this.clickDeleteButton.bind(this, props2[2], props2[1])} color="danger">Delete</Button>
                          { props2[9] === "false" ? (
                            <Button onClick={this.approvePendukung.bind(this, props2[2])} color="success">Approve</Button>
                          ) : (<div/>)
                          }
                        </div>
                      )
                    } else {
                      // return <TableCell onClick={this.viewDetailPendukung} className={classes.tableCell} key={key+i}>{prop}</TableCell>
                      return <TableDetail classes={classes.tableCell} key={key+i} data={prop} identifier={props2[2]}/>
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
};

export default withStyles(tableStyle)(CustomTable);
