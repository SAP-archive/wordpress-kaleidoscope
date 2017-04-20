import React from "react";

import './noResults.css';

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

import AppStore from "../../stores/AppStore";



export default class NoResults extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let styles = {
            display: this.props.showNoResults ? 'block' : 'none'
        };

        return (
            <div id="noResults" style={styles}>
                <p className="noResults_Text" >No results!</p> 
            </div>
        );
    }
}
