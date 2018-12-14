import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectedPendukungAction from "../../action/SelectedPendukungAction";
import DetailPendukung from "./DetailPendukung.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import DaftarPendukungTable from "../Main/DaftarPendukungTable.jsx";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import AddPendukungView from "./AddPendukungView.jsx";
import ApiConfiguration from "../../configuration/ApiConfiguration";
import Button from "components/CustomButtons/Button.jsx";
import DaftarPendukungPdf from "../Pdf/DaftarPendukungPdf.jsx";

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

    this.state = { pendukungs: [], filterProvinsi: "*", filterKabupaten: "*", filterKecamatan: "*", filterKelurahan: "*", filterTps: "*", inProgress: true, renderPdfPreviewDaftarPendukung: false };
    this.props = props;

    this.handleChangeOfFilterByProvinsi = this.handleChangeOfFilterByProvinsi.bind(this);
    this.handleChangeOfFilterByKabupaten = this.handleChangeOfFilterByKabupaten.bind(this);
    this.handleChangeOfFilterByKecamatan = this.handleChangeOfFilterByKecamatan.bind(this);
    this.handleChangeOfFilterByKelurahan = this.handleChangeOfFilterByKelurahan.bind(this);
    this.handleChangeOfFilterByTPS = this.handleChangeOfFilterByTPS.bind(this);
    this.showPreviewPdf = this.showPreviewPdf.bind(this);
    this.closeDetailPendukung = this.closeDetailPendukung.bind(this);

    this.listOfProvinsi = {};
    this.listOfKabupaten = {};
    this.listOfKecamatan = {};
    this.listOfKelurahan = {};
    this.listOfTps = {};

    this.getAllPendukung((result) => {
      this.getListOfProvinsi(result);
      this.getListOfKabupaten(result);
      this.getListOfKecamatan(result);
      this.getListOfKelurahan(result);
      this.getListOfTps(result);
      var pendukungs = this.sortProperties(result, "tps", false);
      this.setState({ pendukungs: pendukungs, inProgress: false });
    });
  }

  closeDetailPendukung() {
    this.props.showSelectedPendukung("");
  }

  showPreviewPdf() {
    this.setState({
      renderPdfPreviewDaftarPendukung: true
    })
  }

  filterPendukung(data, selectedProvinsi, selectedKabupaten, selectedKecamatan, selectedTps, selectedKelurahan) {
    var result = [];

    for(var i = 0; i < data.length; i++) {
      var isAllowed =  true;
      if(selectedProvinsi != "*") {
        if(data[i][0].provinsi != selectedProvinsi) {
          isAllowed = false
        }
      }

      if(selectedKabupaten != "*") {
        if(data[i][0].kabupaten != selectedKabupaten) {
          isAllowed = false;
        }
      }

      if(selectedKecamatan != "*") {
        if(data[i][0].kecamatan != selectedKecamatan) {
          isAllowed = false;
        }
      }

      if(selectedKelurahan != "*") {
        if(data[i][0].kelurahan != selectedKelurahan) {
          isAllowed = false;
        }
      }

      if(selectedTps != "*") {
        if(data[i][0].tps != selectedTps) {
          isAllowed = false;
        }
      }

      if(isAllowed) {
        result.push(data[i]);
      }
    }

    this.setState({
      pendukungs: result,
      filterKabupaten: selectedKabupaten,
      filterProvinsi: selectedProvinsi,
      filterKecamatan: selectedKecamatan,
      filterKelurahan: selectedKelurahan,
      filterTps: selectedTps,
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

      this.filterPendukung(pendukungs, event.target.value, this.state.filterKabupaten, this.state.filterKecamatan, this.state.filterTps, this.state.filterKelurahan);
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

      this.filterPendukung(pendukungs, this.state.filterProvinsi, event.target.value, this.state.filterKecamatan, this.state.filterTps, this.state.filterKelurahan);
    })
  }
  
  handleChangeOfFilterByKecamatan(event) {
    var pendukungs;
    this.setState({
      inProgress: true
    });

    this.getAllPendukung(result => {
      this.getListOfKecamatan(result);
      pendukungs = this.sortProperties(result, "tps", false);

      this.filterPendukung(pendukungs, this.state.filterProvinsi, this.state.filterKabupaten, event.target.value, this.state.filterTps, this.state.filterKelurahan);
    })
  }

  handleChangeOfFilterByKelurahan(event) {
    var pendukungs;
    this.setState({
      inProgress: true
    });

    this.getAllPendukung(result => {
      this.getListOfKelurahan(result);
      pendukungs = this.sortProperties(result, "tps", false);

      this.filterPendukung(pendukungs, this.state.filterProvinsi, this.state.filterKabupaten, this.state.filterKecamatan, this.state.filterTps, event.target.value);
    })
  }
  
  handleChangeOfFilterByTPS(event) {
    var pendukungs;
    this.setState({
      inProgress: true
    });

    this.getAllPendukung(result => {
      this.getListOfTps(result);
      pendukungs = this.sortProperties(result, "tps", false);

      this.filterPendukung(pendukungs, this.state.filterProvinsi, this.state.filterKabupaten, this.state.filterKecamatan, event.target.value, this.state.filterKelurahan);
    })
  }

  getAllPendukung(callback) {
    fetch(ApiConfiguration.url() + '/pemilu/getPendukungs', {
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

  getListOfKecamatan(data) {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        if(!this.listOfKecamatan.hasOwnProperty([data[key].kecamatan])) {
          this.listOfKecamatan[data[key].kecamatan] = data[key].kecamatan;
        }
      }
    }
  }

  getListOfKelurahan(data) {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        if(!this.listOfKelurahan.hasOwnProperty([data[key].kelurahan])) {
          this.listOfKelurahan[data[key].kelurahan] = data[key].kelurahan;
        }
      }
    }
  }
  
  getListOfTps(data) {
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        if(!this.listOfTps.hasOwnProperty([data[key].tps])) {
          this.listOfTps[data[key].tps] = data[key].tps;
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
        temporary["address"] = pendukungs[i].address;
        temporary["provinsi"] = data[j][0].provinsi;
        temporary["kabupaten"] = data[j][0].kabupaten;
        temporary["kecamatan"] = data[j][0].kecamatan;
        temporary["kelurahan"] = data[j][0].kelurahan;
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

    var role = sessionStorage.getItem("role").toLocaleLowerCase()

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

    var kabupatenFilterMenu = <div/>

    if(role == "dprd1" || role == "dprri" || role == "dpd" || role == "ri") {
          kabupatenFilterMenu = (
          <InputLabel shrink htmlFor="age-label-placeholder"> + 
            Filter By Kabupaten + 
          </InputLabel> +
          <br/> +
          <Select 
            value={this.state.filterKabupaten}
            onChange={this.handleChangeOfFilterByKabupaten}
            displayEmpty
            name="FilterKabupaten"
            className={classes.selectEmpty}
          > +
            <MenuItem value="*"><em>All Kabupaten</em></MenuItem> +
            { 
              Object.keys(this.listOfKabupaten).map( (key, index) => { 
                  return (
                      <MenuItem value={this.listOfKabupaten[key]} key={key}>
                          {this.listOfKabupaten[key]}
                      </MenuItem>
                  ) 
              }) 
            } +
          </Select> +
          <br/> +
          <br/> 
          )
    }

    return (
      <GridContainer>
        {
          this.state.renderPdfPreviewDaftarPendukung == true ? (
            <DaftarPendukungPdf listPendukung={dataPendukung}/>
          ) : (
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

                { kabupatenFilterMenu }
                
                <InputLabel shrink htmlFor="age-label-placeholder">
                  Filter By Kecamatan
                </InputLabel>

                <br/>
                <Select
                  value={this.state.filterKecamatan}
                  onChange={this.handleChangeOfFilterByKecamatan}
                  displayEmpty
                  name="FilterKecamatan"
                  className={classes.selectEmpty}
                >
                  <MenuItem value="*"><em>All Kecamatan</em></MenuItem>
                  {
                    Object.keys(this.listOfKecamatan).map( (key, index) => {
                        return (
                            <MenuItem value={this.listOfKecamatan[key]} key={key}>
                                {this.listOfKecamatan[key]}
                            </MenuItem>
                        )
                    })
                  }
                </Select>
                <br/>
                <br/>

                <InputLabel shrink htmlFor="age-label-placeholder">
                  Filter By Kelurahan
                </InputLabel>

                <br/>
                <Select
                  value={this.state.filterKelurahan}
                  onChange={this.handleChangeOfFilterByKelurahan}
                  displayEmpty
                  name="FilterKelurahan"
                  className={classes.selectEmpty}
                >
                  <MenuItem value="*"><em>All Kelurahan</em></MenuItem>
                  {
                    Object.keys(this.listOfKelurahan).map( (key, index) => {
                        return (
                            <MenuItem value={this.listOfKelurahan[key]} key={key}>
                                {this.listOfKelurahan[key]}
                            </MenuItem>
                        )
                    })
                  }
                </Select>
                <br/>
                <br/>

                <InputLabel shrink htmlFor="age-label-placeholder">
                  Filter By TPS
                </InputLabel>

                <br/>
                <Select
                  value={this.state.filterTps}
                  onChange={this.handleChangeOfFilterByTPS}
                  displayEmpty
                  name="FilterKecamatan"
                  className={classes.selectEmpty}
                >
                  <MenuItem value="*"><em>All TPS</em></MenuItem>
                  {
                    Object.keys(this.listOfTps).map( (key, index) => {
                        return (
                            <MenuItem value={this.listOfTps[key]} key={key}>
                                {this.listOfTps[key]}
                            </MenuItem>
                        )
                    })
                  }
                </Select>
                <br/>
                <br/>

                {
                  this.state.renderPdfPreviewDaftarPendukung == false ? (
                    <Button onClick={this.showPreviewPdf} color="primary">Preview Pdf</Button>
                  ) : (
                    <div/>
                  )
                }

                {
                  this.state.inProgress ? (
                      <CircularProgress className={classes.progress} size={50} />
                  ) : 
                  ( 
                    <DaftarPendukungTable
                      tableHeaderColor="primary"
                      tableHead={["ID", "Name", "NIK", "Phone", "Provinsi", "Kabupaten", "Kecamatan", "Kelurahan", "TPS", "Address", "Saksi"]}
                      dataPendukung={dataPendukung}
                    /> 
                  )
                }
              </CardBody>
            </Card>
            
            <AddPendukungView calon="" />
          </GridItem>
          )
        }
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
