import React from "react";
import PropTypes from "prop-types";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import {
  dailySalesChart
} from "variables/charts";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      followers: 0,
      witness: 0,
      notConfirmedFollowers: 0,
      pendukungPerDaerah: [],
      pendukungPerProvinsi: [],
      pendukungPerKabupaten: []
    };

    this.getAllPendukung();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

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
      var data = result.data;
      var counter = 0;
      var witnessCounter = 0;
      var notConfirmedFollowerCounter = 0;
      var pendukungPerDaerah = [];
      var indexCounterPerDaerah = 1;
      var pendukungPerProvinsi = {};
      var pendukungPerKabupaten = {};

      Object.keys(data).map((key) => {
        var tempPendukungPerDaerah = [];
        tempPendukungPerDaerah.push(indexCounterPerDaerah.toString());
        var row = data[key];
        var pendukungs = row.pendukungs;
        for(var i = 0; i < pendukungs.length; i++) {
          counter++;

          if(pendukungs[i].witness == true) {
            witnessCounter++;
          }

          if(pendukungs[i].status == false) {
            notConfirmedFollowerCounter++;
          }
        }

        if(pendukungPerProvinsi.hasOwnProperty(row.provinsi)) {
          pendukungPerProvinsi[row.provinsi] = pendukungPerProvinsi[row.provinsi] + pendukungs.length;
        } else {
          pendukungPerProvinsi[row.provinsi] = pendukungs.length;
        }

        if(pendukungPerKabupaten.hasOwnProperty(row.kabupaten)) {
          pendukungPerKabupaten[row.kabupaten] = pendukungPerKabupaten[row.kabupaten] + pendukungs.length;
        } else {
          pendukungPerKabupaten[row.kabupaten] = pendukungs.length;
        }

        tempPendukungPerDaerah.push(row.kabupaten);
        tempPendukungPerDaerah.push(row.kecamatan);
        tempPendukungPerDaerah.push(row.kelurahan);
        tempPendukungPerDaerah.push(row.provinsi);
        tempPendukungPerDaerah.push(pendukungs.length.toString());

        pendukungPerDaerah.push(tempPendukungPerDaerah);
        indexCounterPerDaerah++;
      });

      var dataPendukungPerProvinsi = [];
      var counterPendukungPerProvinsi = 1;
      Object.keys(pendukungPerProvinsi).map((key) => {
        var tempPendukungPerProvinsi = [];
        tempPendukungPerProvinsi.push(counterPendukungPerProvinsi.toString());
        tempPendukungPerProvinsi.push(key);
        tempPendukungPerProvinsi.push(pendukungPerProvinsi[key].toString());
        counterPendukungPerProvinsi++;
        dataPendukungPerProvinsi.push(tempPendukungPerProvinsi);
      });

      var dataPendukungPerKabupaten = [];
      var counterPendukungPerKabupaten = 1;
      Object.keys(pendukungPerKabupaten).map((key) => {
        var tempPendukungPerKabupaten = [];
        tempPendukungPerKabupaten.push(counterPendukungPerKabupaten.toString());
        tempPendukungPerKabupaten.push(key);
        tempPendukungPerKabupaten.push(pendukungPerKabupaten[key].toString());
        counterPendukungPerKabupaten++;
        dataPendukungPerKabupaten.push(tempPendukungPerKabupaten);
      });

      this.setState({ 
        followers: counter, 
        witness: witnessCounter, 
        notConfirmedFollowers: notConfirmedFollowerCounter,
        pendukungPerDaerah: pendukungPerDaerah,
        pendukungPerProvinsi: dataPendukungPerProvinsi,
        pendukungPerKabupaten: dataPendukungPerKabupaten
      });
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <br/>
                <br/>
                <br/>
                <p className={classes.cardCategory}>Jumlah Pendukung</p>
                <h3 className={classes.cardTitle}>+{this.state.followers}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>content_copy</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Total Pendukung Sebagai Saksi</p>
                <h3 className={classes.cardTitle}>
                  {this.state.witness}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <Update />
                  Just Updated
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={6} md={3}>
            <Card>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>
                  Total Pendukung Yang Belum Di Confirm
                </p>
                <h3 className={classes.cardTitle}>{this.state.notConfirmedFollowers}</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  <LocalOffer />
                  Tracked from Daftar Pendukung
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Dukungan</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
         
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Jumlah Pendukung Untuk Setiap Daerah</h4>
                <p className={classes.cardCategoryWhite}>
                  
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Kabupaten", "Kecamatan", "Kelurahan", "Provinsi", "Jumlah Pendukung"]}
                  tableData={this.state.pendukungPerDaerah}
                />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Jumlah Pendukung Untuk Setiap Provinsi</h4>
                <p className={classes.cardCategoryWhite}>
                  
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Provinsi", "Jumlah Pendukung"]}
                  tableData={this.state.pendukungPerProvinsi}
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Jumlah Pendukung Untuk Setiap Kabupaten</h4>
                <p className={classes.cardCategoryWhite}>
                  
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Kabupaten", "Jumlah Pendukung"]}
                  tableData={this.state.pendukungPerKabupaten}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
