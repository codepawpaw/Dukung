import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import UsersAction from "../../action/UsersAction";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class LoginPage extends React.Component {
    constructor(props = {}) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onClickAlert = this.onClickAlert.bind(this);
        this.state = { loginFailed: false, loginInProgress: false };

        if (typeof this.props.saveUser === "undefined") {
            this.props.saveUser = () => {};
        }
    }

    handleClick(event) {
        this.setState({ loginInProgress: true });
        var username = document.querySelector("#email").value;
        var password = document.querySelector("#password").value;
        this.login({username: username, password: password});
    }

    onClickAlert() {
        this.setState({ loginFailed: false });
    }

    login(auth) {
        var data = JSON.stringify({
            "username": auth.username,
            "password": auth.password
        });
        
        fetch('http://128.199.101.218:8181/pemilu/login', {
            method: 'POST',
            body: data
        })
        .then(response => {
            this.token = response.headers.get("Token");
            return response.json()
        })
        .then(dataResult => {
            if(dataResult.result == true) {
                const userData = {
                    username: dataResult.username,
                    tingkat: dataResult.tingkat,
                    role: dataResult.role
                }

                this.props.saveUser(userData);

                sessionStorage.setItem("key", this.token);

                if(dataResult.role === "ADMIN") {
                    sessionStorage.setItem("admin", "true");
                    this.props.history.push("/admin");
                } else {
                    sessionStorage.setItem("user", JSON.stringify(userData));
                    this.props.history.push("/dashboard");
                }
            } else {
                this.setState({ loginFailed: true, loginInProgress: false })
            }
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                <Card>
                    <CardHeader color="primary">
                    <h4 className={classes.cardTitleWhite}>Login</h4>
                    </CardHeader>
                    <CardBody>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Username"
                            id="email"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Password"
                            id="password"
                            formControlProps={{
                                fullWidth: true
                            }}
                            isPassword={true}
                        />
                        {
                        this.state.loginFailed ? (
                            <SnackbarContent
                                message={
                                'Wrong password or username'
                                }
                                close
                                color="danger"
                                show={this.state.loginFailed}
                                click={this.onClickAlert}
                            />
                        ) : (<div/>)
                        }
                        </GridItem>
                    </GridContainer>
                    {
                        this.state.loginInProgress ? (
                            <CircularProgress className={classes.progress} size={50} />
                        ) : (<div/>)
                    }
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.handleClick} disabled={this.state.loginInProgress} color="primary">Login</Button>
                    </CardFooter>
                </Card>
                </GridItem>
            </GridContainer>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
   users: state.users,
});
  
const mapDispatchToProps = dispatch => ({
    saveUser:(users) => {
        dispatch(UsersAction.elements(users))
    }
});

export { LoginPage }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LoginPage));