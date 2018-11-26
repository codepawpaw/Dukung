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
import CircularProgress from '@material-ui/core/CircularProgress';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";

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

class EditProfile extends React.Component {
    constructor(props = {}) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.onClickAlert = this.onClickAlert.bind(this);

        if (typeof this.props.saveUser === "undefined") {
            this.props.saveUser = () => {};
        }
        this.state = { updateProfileFailed: false, updateProfileInProgress: false };
    }

    onClickAlert() {
        this.setState({ updateProfileFailed: false });
    }

    handleClick(event) {
        this.setState({ updateProfileInProgress: true });
        var oldpassword = document.querySelector("#oldpassword").value;
        var newpassword = document.querySelector("#newpassword").value;
        this.editProfile({oldpassword: oldpassword, newpassword: newpassword});
    }

    editProfile(auth) {
        var data = JSON.stringify({
            "oldpassword": auth.oldpassword,
            "newpassword": auth.newpassword
        });
        
        fetch('http://128.199.101.218:8181/pemilu/changePassword', {
            method: 'POST',
            body: data,
            headers: {
                "Content-Type": "application/json",
                "token": sessionStorage.getItem("key")
            }
        })
        .then(response => {
            return response.json()
        })
        .then(dataResult => {
            if(dataResult.result == true) {
                this.props.history.push("/dashboard");
            } else {
                this.setState({ updateProfileFailed: true, updateProfileInProgress: false });
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
                    <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                    </CardHeader>
                    <CardBody>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Old Password"
                            id="oldpassword"
                            formControlProps={{
                                fullWidth: true
                            }}
                            isPassword={true}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="New Password"
                            id="newpassword"
                            formControlProps={{
                                fullWidth: true
                            }}
                            isPassword={true}
                        />

                        {
                            this.state.updateProfileFailed ? (
                                <SnackbarContent
                                    message={
                                    'Anda memasukkan password lama dengan input yang salah. Mohon dicek kembali'
                                    }
                                    close
                                    color="danger"
                                    show={this.state.updateProfileFailed}
                                    click={this.onClickAlert}
                                />
                            ) : (<div/>)
                        }
                        </GridItem>
                    </GridContainer>
                    {
                        this.state.updateProfileInProgress ? (
                            <CircularProgress className={classes.progress} size={50} />
                        ) : (<div/>)
                    }
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.handleClick} disabled={this.state.updateProfileInProgress} color="primary">Update Profile</Button>
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

export { EditProfile }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditProfile));