import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from "@material-ui/core/TableHead";
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Button from "components/CustomButtons/Button.jsx";
import SnackbarWithConfirmation from "components/Snackbar/SnackbarWithConfirmation.jsx";
import AddAlert from "@material-ui/icons/AddAlert";
import TableDetail from "components/Table/TableDetail.jsx";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

let counter = 0;
function createData(name, calories, fat) {
  counter += 1;
  return { id: counter, name, calories, fat };
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class DaftarPendukungTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
       page: 0,
       rowsPerPage: 5,
       selectedName: "",
       selectedNik: ""
    };

    this.clickDeletePendukung = this.clickDeletePendukung.bind(this);
    this.deletePendukung = this.deletePendukung.bind(this);
    this.hideDeleteAlert = this.hideDeleteAlert.bind(this);
  }

  clearAlertTimeout() {
    if (this.alertTimeout !== null) {
      clearTimeout(this.alertTimeout);
    }
  }

  hideDeleteAlert() {
    this.setState({ tc: false });
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

  deletePendukung() {
      var nik = this.state.selectedNik;
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
        window.location = "/daftar-dukungan";
      });
  }

  clickDeletePendukung(nik, name) {
    this.setState({ selectedNik: nik, selectedName: name });
    this.showNotification("tc");
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, tableHead, tableHeaderColor } = this.props;
    const rows = this.props.dataPendukung;
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const messageAlert = "Apakah kamu yakin akan menghapus "+ this.state.selectedName + " dari daftar pendukung ?"

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <SnackbarWithConfirmation
            place="tc"
            color="rose"
            icon={AddAlert}
            message={messageAlert}
            open={this.state.tc}
            deleteButton={this.deletePendukung}
            cancelButton={this.hideDeleteAlert}
            closeNotification={() => this.setState({ tc: false })}
            close
          />
          <Table className={classes.table}>
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
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell classes={classes.tableCell}>{row.id}</TableCell>
                    <TableCell classes={classes.tableCell} component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableDetail classes={classes.tableCell} key={row.id} data={row.nik} identifier={row.nik}/>
                    <TableCell classes={classes.tableCell}>{row.phone}</TableCell>
                    <TableCell classes={classes.tableCell}>{row.provinsi}</TableCell>
                    <TableCell classes={classes.tableCell}>{row.kabupaten}</TableCell>
                    <TableCell classes={classes.tableCell}>{row.kecamatan}</TableCell>
                    <TableCell classes={classes.tableCell}>{row.tps}</TableCell>
                    <TableCell classes={classes.tableCell}>{row.witness}</TableCell>
                    <TableCell>
                        <Button onClick={this.clickDeletePendukung.bind(this, row.nik, row.name)} color="danger">Delete</Button>
                    </TableCell>
                    <TableCell>
                        {
                            row.status === "false" ? (
                                <Button onClick={this.approvePendukung.bind(this, row.nik)} color="success">Approve</Button>
                            ) : (
                                <div/>
                            ) 
                        }
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

DaftarPendukungTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DaftarPendukungTable);