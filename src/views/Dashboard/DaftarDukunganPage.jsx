import React from "react";
import { connect } from "react-redux";
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
import SelectedPendukungAction from "../../action/selected_pendukung_action";
import DetailPendukung from "./DetailPendukung.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import DaftarPendukungTable from "../Main/DaftarPendukungTable.jsx";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

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

    this.state = { pendukungs: [], sendFailed: false, checked: false, addPendukungInProgress: false, filterProvinsi: "*", filterKabupaten: "*", inProgress: true };
    this.props = props;

    this.onChange = this.onChange.bind(this);
    this.handleChangeOfFilterByProvinsi = this.handleChangeOfFilterByProvinsi.bind(this);
    this.handleChangeOfFilterByKabupaten = this.handleChangeOfFilterByKabupaten.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.sendFailed = false;
    this.onChecked = this.onChecked.bind(this);
    this.closeDetailPendukung = this.closeDetailPendukung.bind(this);

    this.listOfProvinsi = {};
    this.listOfKabupaten = {};

    this.getAllPendukung((result) => {
      this.getListOfProvinsi(result);
      this.getListOfKabupaten(result);
      var pendukungs = this.sortProperties(result, "tps", false);
      this.setState({ pendukungs: pendukungs, inProgress: false });
    });
  }

  closeDetailPendukung() {
    this.props.showSelectedPendukung("");
  }

  onChecked() {
    this.setState({ checked: !this.state.checked })
  }

  handleClick(event) {
      this.setState({ addPendukungInProgress: true });

      var nik = document.querySelector("#nik").value;
      var phone = document.querySelector("#phone").value;
      var witness = document.querySelector("#witness").value;
      var address = document.querySelector("#address").value;
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
          address: address,
          firstname: firstname
      });
  }

  filterPendukung(data, selectedProvinsi, selectedKabupaten) {
    var result = [];

    for(var i = 0; i < data.length; i++) {
      if(selectedProvinsi == "*" && selectedKabupaten != "*") {
        if(data[i][0].kabupaten == selectedKabupaten) {
          result.push(data[i]);
        }
      } else if(selectedProvinsi != "*" && selectedKabupaten == "*") {
        if(data[i][0].provinsi == selectedProvinsi) {
          result.push(data[i]);
        }
      } else if(selectedProvinsi != "*" && selectedKabupaten != "*") {
        if(data[i][0].provinsi == selectedProvinsi && data[i][0].kabupaten == selectedKabupaten) {
          result.push(data[i]);
        }
      } else if(selectedProvinsi == "*" && selectedKabupaten == "*") {
        result.push(data[i]);
      }
    }

    this.setState({
      pendukungs: result,
      filterKabupaten: selectedKabupaten,
      filterProvinsi: selectedProvinsi,
      inProgress: false
    })
  }

  handleChangeOfFilterByProvinsi(event) {
    var pendukungs;
    this.setState({
      inProgress: true
    });
    this.getAllPendukung(result => {
      this.getListOfProvinsi(result);
      pendukungs = this.sortProperties(result, "tps", false);

      this.filterPendukung(pendukungs, event.target.value, this.state.filterKabupaten);
    })
  }

  handleChangeOfFilterByKabupaten(event) {
    var pendukungs;
    this.setState({
      inProgress: true
    });

    this.getAllPendukung(result => {
      this.getListOfKabupaten(result);
      pendukungs = this.sortProperties(result, "tps", false);

      this.filterPendukung(pendukungs, this.state.filterProvinsi, event.target.value);
    })
  }

  addDukungan(data) {
      var formData = new FormData();
      formData.append('uploadfile', this.uploadfile);
      formData.append('idcalon', "");
      formData.append('nik', data.nik);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
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
            this.setState({ sendFailed: true, addPendukungInProgress: false });
          }
      })
  }

  onChange(e) {
      this.uploadfile = e.target.files[0];
      this.setState({file:e.target.files[0]})
  }
  
  getAllPendukung(callback) {
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
      callback(result.data)
    })
  }

  getListOfProvinsi(data) {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        if(!this.listOfProvinsi.hasOwnProperty([data[key].provinsi])) {
          this.listOfProvinsi[data[key].provinsi] = data[key].provinsi;
        }
      }
    }
  }

  getListOfKabupaten(data) {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        if(!this.listOfKabupaten.hasOwnProperty([data[key].kabupaten])) {
          this.listOfKabupaten[data[key].kabupaten] = data[key].kabupaten;
        }
      }
    }
  }

  sortProperties(obj, sortedBy, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    reverse = reverse || false; // by default no reverse

    var reversed = (reverse) ? -1 : 1;

    var sortable = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([obj[key]]);
        }
    }

    sortable.sort(function (a, b) {
        return ('' + a[0][sortedBy]).localeCompare(b[0][sortedBy]);
    });

    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

  render() {
    const { classes } = this.props;
    var data = this.state.pendukungs;
    var dataPendukung = [];
    var counter = 1;
    for(var j = 0; j < data.length; j++) {
      var pendukungs = data[j][0].pendukungs;
      for(var i = 0; i < pendukungs.length; i++) {
        var temporary = {};
        temporary["id"] = counter.toString();
        temporary["name"] = pendukungs[i].name;
        temporary["nik"] = pendukungs[i].nik;
        temporary["phone"] = pendukungs[i].phone;
        temporary["provinsi"] = data[j][0].provinsi;
        temporary["kabupaten"] = data[j][0].kabupaten;
        temporary["kecamatan"] = data[j][0].kecamatan;
        temporary["tps"] = data[j][0].tps;
        if(pendukungs[i].witness === true) {
          temporary["witness"] = "Ya";
        } else {
          temporary["witness"] = "Tidak";
        }
        temporary["status"] = pendukungs[i].status.toString();
        temporary["calories"] = 120;
        temporary["fat"] = 200;

        dataPendukung.push(temporary);
        counter++;
      }
    }

    if(this.props.selectedPendukung.length > 0) {
      return (
        <div onClick={this.closeDetailPendukung}>
        <DetailPendukung
          message={
            'Detail User'
          }
          close
          color="info"
          nik={this.props.selectedPendukung}
        />
        </div>
      )
    }

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
              <InputLabel shrink htmlFor="age-label-placeholder">
                Filter By Provinsi
              </InputLabel>
              <br/>
              <Select
                value={this.state.filterProvinsi}
                onChange={this.handleChangeOfFilterByProvinsi}
                displayEmpty
                name="FilterProvinsi"
                className={classes.selectEmpty}
              >
                <MenuItem value="*"><em>All Provinsi</em></MenuItem>
                {
                  Object.keys(this.listOfProvinsi).map( (key, index) => {
                      return (
                          <MenuItem value={this.listOfProvinsi[key]} key={key}>
                              {this.listOfProvinsi[key]}
                          </MenuItem>
                      )
                  })
                }
              </Select>

              <br/>
              <br/>

              <InputLabel shrink htmlFor="age-label-placeholder">
                Filter By Kabupaten
              </InputLabel>

              <br/>
              <Select
                value={this.state.filterKabupaten}
                onChange={this.handleChangeOfFilterByKabupaten}
                displayEmpty
                name="FilterKabupaten"
                className={classes.selectEmpty}
              >
                <MenuItem value="*"><em>All Kabupaten</em></MenuItem>
                {
                  Object.keys(this.listOfKabupaten).map( (key, index) => {
                      return (
                          <MenuItem value={this.listOfKabupaten[key]} key={key}>
                              {this.listOfKabupaten[key]}
                          </MenuItem>
                      )
                  })
                }
              </Select>
              <br/>
              <br/>
              {
                this.state.inProgress ? (
                    <CircularProgress className={classes.progress} size={50} />
                ) : 
                ( 
                  <DaftarPendukungTable
                    tableHeaderColor="primary"
                    tableHead={["ID", "Name", "NIK", "Phone", "Provinsi", "Kabupaten", "Kecamatan", "TPS", "Saksi"]}
                    dataPendukung={dataPendukung}
                  /> 
                )
              }
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
            {
              this.state.addPendukungInProgress ? (
                <CircularProgress className={classes.progress} size={50} />
               ) : (<div/>)
            }
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

const mapStateToProps = (state, props) => ({
  selectedPendukung: state.selected_pendukung
});

const mapDispatchToProps = dispatch => ({
  showSelectedPendukung: nik => {
    dispatch(SelectedPendukungAction.elements(nik));
  },
});

export { DaftarDukunganPage };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DaftarDukunganPage));
