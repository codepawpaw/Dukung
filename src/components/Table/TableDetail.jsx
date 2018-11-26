import React from "react";
import { connect } from "react-redux";
import TableCell from "@material-ui/core/TableCell";
import SelectedPendukungAction from "../../action/SelectedPendukungAction";

class TableDetail extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.showSelectedPendukung(this.props.identifier);
    }

    render() {
        return(
            <TableCell onClick={this.onClick} className={this.props.classes} key={this.props.key}>{this.props.data}</TableCell>
        )
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

export { TableDetail };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableDetail);