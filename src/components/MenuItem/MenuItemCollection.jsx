import React from "react";
import MenuItem from '@material-ui/core/MenuItem';

class MenuItemCollection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            Object.keys(this.props.collectionItem).map( (key, index) => {
                return (
                    <MenuItem value={this.props.collectionItem[key]} key={key}>
                        {this.props.collectionItem[key]}
                    </MenuItem>
                )
            })
        )
    }
}

export default (MenuItemCollection);