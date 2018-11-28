import React from "react";
import HTTPRequestAdapter from "adapter/HTTPRequestAdapter.js";
import AddPendukungView from "./AddPendukungView.jsx";
import ApiConfiguration from "configuration/ApiConfiguration.js";

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
        HTTPRequestAdapter.get({ url: ApiConfiguration.url() + '/pemilu/'+username }, (dataResult) => {
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