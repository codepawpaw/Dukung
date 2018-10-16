class PendukungModel {
    constructor(data) {
        this.idcalon = data.idcalon;
        this.firstname = data.firstname;
        this.name = data.name;
        this.nik = data.nik;
        this.phone = data.phone;
        this.provinsi = data.provinsi;
        this.kabupaten = data.kabupaten;
        this.tps = data.tps;
        this.witness = data.witness;
        this.uploadfile = data.uploadfile;
    }   

    toFormData() {
        var formData = new FormData();
        formData.append('uploadfile', this.uploadfile);
        formData.append('idcalon', this.idcalon);
        formData.append('nik', this.nik);
        formData.append('phone', this.phone);
        formData.append('witness', this.witness);
        formData.append('firstname', this.firstname);

        return formData;
    }
}

export default PendukungModel;