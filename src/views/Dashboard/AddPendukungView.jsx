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
import ApiConfiguration from "configuration/ApiConfiguration.js";

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

        this.compressImage(this.uploadfile, (compressedImage) => {
            this.addDukungan({
                nik: nik,
                phone: phone,
                witness: wt,
                firstname: firstname,
                uploadfile: compressedImage,
                address: address,
                idcalon: this.props.calon.id
            });
        });
    }

    dataURLToBlob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];
    
            return new Blob([raw], {type: contentType});
        }
    
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
    
        var uInt8Array = new Uint8Array(rawLength);
    
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
    
        return new Blob([uInt8Array], {type: contentType});
    }

    compressImage(image, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(image);

        reader.onload = (readerEvent) => {
            var image = new Image();

            image.onload = (imageEvent) => {
                var canvas = document.createElement('canvas'),
                    max_size = 144,// TODO : pull max size from a site config
                    width = image.width,
                    height = image.height;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/png');
                var resizedImage = this.dataURLToBlob(dataUrl);
                callback(resizedImage);
            }

            image.src = readerEvent.target.result;
        }
    }

    addDukungan(data) {
        const pendukungModel = new PendukungModel(data);

        const url = ApiConfiguration.url() + '/pemilu/addPendukung';
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
        const blobData = this.convertImageToBlob(this.uploadfile);
        //this.setState({file:e.target.files[0]})
        this.setState({ file : blobData })
    }

    convertImageToBlob(imageFile) {
        const img = new Image();
        img.src = imageFile;
        const elem = document.createElement('canvas');
        const ctx = elem.getContext('2d')
        ctx.drawImage(img, 0, 0, 200, 200);

        const data = ctx.canvas.toDataURL(img, 'image/jpeg', 1.0);

        return data;
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