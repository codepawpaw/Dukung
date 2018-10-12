import React from "react";
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
import Checkbox from "@material-ui/core/Checkbox";
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

class DukungPage extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            file:null,
            checked: false,
            addPendukungInProgress: false
        }
        this.onChange = this.onChange.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.username = window.location.pathname.split('/')[2];
        this.getCalon(this.username);
        this.onChecked = this.onChecked.bind(this);
    }

    onChecked() {
        this.setState({ checked: !this.state.checked })
    }

    getCalon(username) {
        fetch('http://128.199.101.218:8181/pemilu/'+username, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .then(dataResult => {
            this.name = dataResult.name;
            this.tingkat = dataResult.tingkat;
            this.setState({profiles: dataResult})
        })
    }

    handleClick(event) {
        this.setState({ addPendukungInProgress: true });
        var nik = document.querySelector("#nik").value;
        var phone = document.querySelector("#phone").value;
        var witness = document.querySelector("#witness").value;
        var firstname = document.querySelector("#firstname").value;
        var wt = "0";

        if(witness) {
            wt = "1";
        }

        this.addDukungan({
            uploadfile: this.state.file, 
            nik: nik,
            phone: phone,
            witness: wt,
            firstname: firstname
        });
    }

    addDukungan(data) {
        var formData = new FormData();
        formData.append('uploadfile', this.uploadfile);
        formData.append('idcalon', this.state.profiles.idCalon);
        formData.append('nik', data.nik);
        formData.append('phone', data.phone);
        formData.append('witness', data.witness);
        formData.append('firstname', data.firstname);

        const options = {
            method: 'POST',
            body: formData
        };

        fetch('http://128.199.101.218:8181/pemilu/addPendukung', options)
        .then(response => {
            window.location= "/dukung/"+this.username;
        })
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
                    <h4 className={classes.cardTitleWhite}>
                        Ajukan Dukungan Kamu kepada {this.name} untuk tingkat {this.tingkat}
                    </h4>
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
                                <h3>Upload Photo</h3>
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
                        <Checkbox
                        checked={this.state.checked}
                        onChange={this.onChecked}
                        id={"witness"}
                        value={this.state.checked}
                        />Daftar sebagai saksi
                        {/* <CustomInput
                            labelText="Witness"
                            id="witness"
                            formControlProps={{
                                fullWidth: true
                            }}
                        /> */}
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

export default withStyles(styles)(DukungPage);