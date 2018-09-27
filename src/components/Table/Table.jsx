import React from "react";
import PropTypes from "prop-types";
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

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
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
        //this.setState({ users: dataResult });
      });
  }

  deletePendukung(nik) {
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
        //this.setState({ users: dataResult });
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
    return (
      <div className={classes.tableResponsive}>
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
                          <Button onClick={this.deletePendukung.bind(this, props2[2])} color="danger">Delete</Button>
                          { props2[7] === "false" ? (
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
