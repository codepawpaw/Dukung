import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from '@material-ui/core/CircularProgress';
import HTTPRequestAdapter from "adapter/HTTPRequestAdapter.js";
import PendukungModel from "models/PendukungModel.js";
import TextField from '@material-ui/core/TextField';
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

class AddPendukungView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file:null,
            isWitness: false,
            addPendukungInProgress: false,
            addPendukungFailed: false
        };

        this.onChange = this.onChange.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.onChecked = this.onChecked.bind(this);
    }

    onChecked() {
        this.setState({ isWitness: !this.state.isWitness })
    }

    handleClick(event) {
        this.setState({ addPendukungInProgress: true });
        var nik = document.querySelector("#nik").value;
        var phone = document.querySelector("#phone").value;
        var address = document.querySelector("#address").value;
        var witness = document.querySelector("#witness").value;
        var firstname = document.querySelector("#firstname").value;
        var wt = "0";

        if(witness == "true") {
            wt = "1";
        }

        this.addDukungan({
            uploadfile: this.state.file, 
            nik: nik,
            phone: phone,
            witness: wt,
            firstname: firstname,
            uploadfile: this.uploadfile,
            address: address,
            idcalon: this.props.calon.id
        });
    }

    addDukungan(data) {
        const pendukungModel = new PendukungModel(data);

        const url = 'http://128.199.101.218:8181/pemilu/addPendukung';
        const body = pendukungModel.toFormData();

        if(sessionStorage.getItem("key") == null) {
            var options = {
                url: url,
                body: body
            };
        } else {
            var options = {
                url: url,
                body: body,
                headers: {
                    "token": sessionStorage.getItem("key"),
                }
            };
        }

        HTTPRequestAdapter.post(options, (response) => {
            if(response.result == true) {
                window.location.href = window.location.href;
            } else {
                this.setState({ addPendukungFailed: true, addPendukungInProgress: false });
            }
        });
    }

    onChange(e) {
        this.uploadfile = e.target.files[0];
        this.setState({file:e.target.files[0]})
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                <Card>
                    <CardHeader color="warning">
                    {
                        this.props.calon !== "" ? (
                            <h4 className={classes.cardTitleWhite}>
                                Ajukan Dukungan Kamu kepada {this.props.calon.name} untuk tingkat {this.props.calon.tingkat}
                            </h4>
                        ) : (
                            <div/>
                        )
                    }
                    <p className={classes.cardCategoryWhite}>Mohon isi dengan benar</p>
                    </CardHeader>
                    <CardBody>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                        <CustomInput
                            labelText="Firstname"
                            id="firstname"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                        <CustomInput
                            labelText="NIK"
                            id="nik"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                            <form onSubmit={this.onFormSubmit}>
                                <h3>Upload Photo KTP</h3>
                                <input type="file" onChange={this.onChange} />
                            </form>
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                        <CustomInput
                            labelText="Phone Number"
                            id="phone"
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                        <TextField
                            id="address"
                            label="Address"
                            multiline
                            rows="4"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                        </GridItem>
                    </GridContainer>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={5}>
                        <Checkbox
                        checked={this.state.isWitness}
                        onChange={this.onChecked}
                        id={"witness"}
                        value={this.state.isWitness}
                        />Daftar sebagai saksi
                        {
                        this.state.addPendukungFailed ? (<SnackbarContent
                            message={
                            'Tambahkan pendukung gagal. Dimohon untuk cek data anda kembali'
                            }
                            close
                            color="danger"
                        />) : (<div/>)
                        }
                        </GridItem>
                    </GridContainer>
                    {
                        this.state.addPendukungInProgress ? (
                            <CircularProgress className={classes.progress} size={50} />
                        ) : (<div/>)
                    }
                    </CardBody>
                    <CardFooter>
                    <Button onClick={this.handleClick} color="warning">Dukung</Button>
                    </CardFooter>
                </Card>
                </GridItem>
            </GridContainer>
            </div>
        );
    }
}

export default withStyles (styles)(AddPendukungView)