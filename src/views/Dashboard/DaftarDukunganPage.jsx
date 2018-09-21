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
import Button from "components/CustomButtons/Button.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Checkbox from "@material-ui/core/Checkbox";
import CheckboxIcon from "./CheckboxIcon.svg";

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

class DaftarDukunganPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = { pendukungs: [], sendFailed: false, checked: false };
    this.props = props;
    this.getAllPendukung();
    this.onChange = this.onChange.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.sendFailed = false;
    this.onChecked = this.onChecked.bind(this);
  }

  onChecked() {
    this.setState({ checked: !this.state.checked })
  }

  handleClick(event) {
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
      formData.append('idcalon', "");
      formData.append('nik', data.nik);
      formData.append('phone', data.phone);
      formData.append('witness', data.witness);
      formData.append('firstname', data.firstname);

      const options = {
        method: 'POST',
        body: formData,
        headers: {
            "token": sessionStorage.getItem("key"),
        }
      };

      delete options.headers['Content-Type'];
      fetch('http://128.199.101.218:8181/pemilu/addPendukung', options)
      .then(response => {
          if(response.ok == true && response.status == 200) {
            window.location = "/daftar-dukungan";
          } else {
            this.sendFailed = true;
            this.setState({ sendFailed: true });
          }
      })
  }

  onChange(e) {
      this.uploadfile = e.target.files[0];
      this.setState({file:e.target.files[0]})
  }
  
  getAllPendukung() {
    fetch('http://128.199.101.218:8181/pemilu/getPendukungs', {
        method: 'GET',
        headers: {
          "token": sessionStorage.getItem("key")
        }
    })
    .then(response => {
      return response.json();
    })
    .then(result => {
      this.setState({ pendukungs: result.data });
    })
  }

  render() {
    const { classes } = this.props;
    var data = this.state.pendukungs;
    var displayedData = [];
    var counter = 1;
    Object.keys(data).map((key) => {
      var temp = [];
      var pendukungs = data[key].pendukungs;
      for(var i = 0; i < pendukungs.length; i++) {
        temp.push(counter.toString());
        temp.push(pendukungs[i].name);
        temp.push(pendukungs[i].nik);
        temp.push(pendukungs[i].phone);
        temp.push(data[key].provinsi);
        temp.push(data[key].kabupaten);
        temp.push(data[key].kecamatan);
        temp.push(pendukungs[i].status.toString());
        counter++;
      }
      displayedData.push(temp);
    })

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Daftar Dukungan
              </h4>
              <p className={classes.cardCategoryWhite}>
                Daftar dibawah ini menampilkan deretan orang yang sudah mendukung anda
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Name", "NIK", "Phone", "Provinsi", "Kabupaten", "Kecamatan"]}
                tableData={displayedData}
                withActionButtonDeletePendukung={true}
                withActionButtonApprove={true}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Tambahkan Pendukung</h4>
              <p className={classes.cardCategoryWhite}>Tambahkan Lebih Banyak Pendukung Untuk Meningkatkan Kejayaan Indonesia</p>
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
                        <input type="file" id="afile" onChange={this.onChange} accept="image/*"/>
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
                  value={this.state.checked.toString()}
                />Daftar sebagai saksi
                {
                  this.state.sendFailed ? (<SnackbarContent
                    message={
                      'Tambahkan pendukung gagal. Dimohon untuk cek data anda kembali'
                    }
                    close
                    color="danger"
                  />) : (<div/>)
                }
                </GridItem>
            </GridContainer>
            </CardBody>
            <CardFooter>
              <Button onClick={this.handleClick} color="primary">Tambahkan Pendukung</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(styles)(DaftarDukunganPage);
