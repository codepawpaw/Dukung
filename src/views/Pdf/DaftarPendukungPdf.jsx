import React from "react";
import Button from "components/CustomButtons/Button.jsx";
import { PDFExport } from '@progress/kendo-react-pdf';

class DaftarPendukungPdf extends React.Component{
    pdfExportComponent;
  
    constructor(props) {
        super(props);

        this.state = {};
    }

    downloadPDF = () => {
        this.pdfExportComponent.save();
    }

    refresh = () => {
        window.location.reload();
    }

    render() {
        var listPendukung = this.props.listPendukung;
        return (
            <div>
                <div className="example-config">
                    <Button onClick={this.refresh} color="danger">Back</Button>
                    <Button onClick={this.downloadPDF} color="primary">Download PDF</Button>
                </div>

                <PDFExport ref={(component) => this.pdfExportComponent = component} paperSize="A2">
                    <table cellSpacing="20">
                        <tr>
                            <th> Id </th>
                            <th> Name </th>
                            <th> NIK </th>
                            <th> Phone </th>
                            <th> Provinsi </th>
                            <th> Kabupaten </th>
                            <th> Kelurahan </th>
                            <th> TPS </th>
                            <th> Address </th>
                            <th> Saksi </th>
                        </tr>
                        {
                            listPendukung.map(row => {
                                return (
                                    <tr>
                                        <td>{ row.id }</td>
                                        <td>{ row.name }</td>
                                        <td>{ row.nik }</td>
                                        <td>{ row.phone }</td>
                                        <td>{ row.provinsi }</td>
                                        <td>{ row.kabupaten }</td>
                                        <td>{ row.kelurahan }</td>
                                        <td>{ row.tps }</td>
                                        <td>{ row.address }</td>
                                        <td>{ row.witness ? ( "Ya" ) : ( "Tidak" ) }</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </PDFExport>
            </div>
        )
    }
}

export default (DaftarPendukungPdf);