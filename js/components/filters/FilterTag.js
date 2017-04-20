require("!style!raw!sass!./filtertag.scss");
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";


export default class FilterTag extends React.Component {

    constructor(props) {
        super(props);
        this.height = 'auto';
        this.onClick = this.onClick.bind(this);
    }

    render() {
        let className = this.props.subFilterTitle === 'clear all' || this.props.subFilterTitle === 'copy link' ? ' filtertag__clearall' : '';
        let legendClass = `filtertag__legenditem__${this.props.subFilterTitle.toLowerCase().replace(/\W/g, '')}`;

        let removeTag = <span className="fitlertag__remove">&times;</span>;
        if (className !== ""){
            removeTag = null;
        }


        return (
            <div className={"filtertag"+className} onClick={this.onClick}>
                <span className={"filtertag__legenditem "+legendClass}></span>
                <span className="filtertag__filtertitle">{this.props.subFilterTitle}</span>
                {removeTag}
            </div>
        );
    }

    onClick(event) {
        event.stopPropagation();
        if (this.props.subFilterTitle === 'clear all') {
            Actions.trigger(ActionTypes.CLEAR_FILTERS);
        } else if (this.props.subFilterTitle === 'copy link') {
            Actions.trigger(ActionTypes.COPY_LINK);
        } else {
            Actions.trigger(ActionTypes.SWITCH_SUB_FILTER, this.props.title, this.props.subFilterTitle);
        }
    }
}

FilterTag.propTypes = {
    title: React.PropTypes.string.isRequired,
    subFilterTitle: React.PropTypes.string.isRequired
};
