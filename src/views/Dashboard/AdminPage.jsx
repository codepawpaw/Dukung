import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Button from '@material-ui/core/Button';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class AdminPage extends React.Component {
    constructor(props) {
      super(props);

      this.state = { users: [], addFailed: false};
      this.handleClick = this.handleClick.bind(this);
      this.deleteUser = this.deleteUser.bind(this);
      this.closeNotification = this.closeNotification.bind(this);
      this.getUser();
      this.isClose = false;
    }

    closeNotification() {
      this.setState({ addFailed: false });
    }

    handleClick(event) {
        var username = document.querySelector("#username").value;
        var tingkatElement = document.getElementById("tingkat");
        var tingkat = tingkatElement.options[tingkatElement.selectedIndex].value;
        var name = document.querySelector("#name").value;
        var password = document.querySelector("#password").value;
        this.addUser({name: name, username: username, tingkat: tingkat, password: password});
    }

    getUser() {
      fetch('http://128.199.101.218:8181/pemilu/getUsers', {
          method: 'GET',
          headers: {
            "token": sessionStorage.getItem("key")
          }
      })
      .then(response => {
          return response.json();
      })
      .then(dataResult => {
        this.setState({ users: dataResult });
      });
    }

    deleteUser(userId) {
      fetch('http://128.199.101.218:8181/pemilu/deleteUser?id='+userId, {
          method: 'GET',
          headers: {
            "token": sessionStorage.getItem("key")
          }
      })
      .then(response => {
          return response.json();
      })
      .then(dataResult => {
          this.props.history.push("/admin");
      });
    }

    addUser(user) {
        var data = {
            "name": user.name,
            "username": user.username,
            "tingkat": user.tingkat,
            "password": user.password
        };

        fetch('http://128.199.101.218:8181/pemilu/addUser', {
            method: 'POST',
            headers: {
              "token": sessionStorage.getItem("key")
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        })
        .then(dataResult => {
          if(dataResult.result === true) {
            var temp = this.state.users;
            temp.push(data);
            window.location = "/admin";
          } else {
            this.setState({ addFailed: true });
          }
        });
    }

    render() {
      const { classes } = this.props;
      var data = [];
      for(var i = 0; i < this.state.users.length; i++) {
        var temp = [];
        const index = i + 1;
        temp.push(index.toString());
        temp.push(this.state.users[i].name);
        temp.push(this.state.users[i].tingkat);
        temp.push(this.state.users[i].id);
        data.push(temp);
      }

      return (
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card plain>
              <CardHeader plain color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Daftar User
                </h4>
                <p className={classes.cardCategoryWhite}>
                  Daftar dibawah ini menampilkan deretan user beserta hak akses nya
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["ID", "Name", "Tingkat"]}
                  tableData={
                    data
                  }
                  withActionButton={true}
                />
              </CardBody>
            </Card>
            <Card>
                <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Tambahkan User</h4>
                </CardHeader>
                <CardBody>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                        labelText="Nama"
                        id="name"
                        formControlProps={{
                            fullWidth: true
                        }}
                    />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                    <br/>
                    <br/>
                    <select id="tingkat">
                      <option value="DPRD1">DPRD1</option>
                      <option value="DPRD2">DPRD2</option>
                      <option value="DPRR1">DPRR1</option>
                      <option value="DPD">DPD</option>
                      <option value="RI">RI</option>
                    </select>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                        labelText="Username"
                        id="username"
                        formControlProps={{
                            fullWidth: true
                        }}
                    />
                    {
                      this.state.addFailed ? (
                      <div onClick={this.closeNotification}>
                        <SnackbarContent
                          message={
                            'Tambahkan user gagal. Mohon cek data anda kembali'
                          }
                          close
                          color="danger"
                        />
                      </div>
                      ) : (<div/>)
                    }
                    </GridItem>
                    <GridItem xs={12} sm={12} md={5}>
                    <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                            fullWidth: true
                        }}
                        isPassword={true}
                    />
                    </GridItem>
                </GridContainer>
                </CardBody>
                <CardFooter>
                <Button onClick={this.handleClick} color="primary">Tambahkan User</Button>
                </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      );
    }
}

export default withStyles(styles)(AdminPage);
