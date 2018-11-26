import React from "react";
import HTTPRequestAdapter from "adapter/HTTPRequestAdapter.js";
import AddPendukungView from "./AddPendukungView.jsx";

class DukungPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calon: {}
        }

        this.username = window.location.pathname.split('/')[2];
        this.getCalon(this.username);
    }

    getCalon(username) {
        HTTPRequestAdapter.get({ url: 'http://128.199.101.218:8181/pemilu/'+username }, (dataResult) => {
            this.setState({ calon: { name: dataResult.name, tingkat: dataResult.tingkat, id: dataResult.idCalon } })
        });
    }

    render() {
        return (
            <AddPendukungView calon={ this.state.calon } />
        )
    }
}

export default (DukungPage);