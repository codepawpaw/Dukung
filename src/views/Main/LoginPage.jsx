import React from "react";
import { connect } from "react-redux";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Axios from "axios";
import UsersAction from "../../action/users_action";

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

        if (typeof this.props.saveUser === "undefined") {
            this.props.saveUser = () => {};
        }
    }

    handleClick(event) {
        var username = document.querySelector("#email").value;
        var password = document.querySelector("#password").value;
        this.login({username: username, password: password});
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
                            labelText="Email"
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
                        </GridItem>
                    </GridContainer>
                    </CardBody>
                    <CardFooter>
                    <Button onClick={this.handleClick} color="primary">Login</Button>
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