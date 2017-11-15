require("!style!raw!sass!./filtertag.scss");
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import PropTypes from 'prop-types';

export default class FilterTag extends React.Component {

    constructor(props) {
        super(props);
        this.height = 'auto';
        this.onClick = this.onClick.bind(this);
    }

    render() {
        let className = this.props.subFilterTitle === 'reset filters' || this.props.subFilterTitle === 'copy link'  ||  this.props.subFilterTitle === 'contact all'  ? ' filtertag__clearall' : '';
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
        if (this.props.subFilterTitle === 'reset filters') {
            Actions.trigger(ActionTypes.CLEAR_FILTERS);
        } else if (this.props.subFilterTitle === 'copy link') {
            Actions.trigger(ActionTypes.COPY_LINK);
        } else if (this.props.subFilterTitle === 'contact all') {
            Actions.trigger(ActionTypes.CONTACT_ALL);
        } else {
            Actions.trigger(ActionTypes.SWITCH_SUB_FILTER, this.props.title, this.props.subFilterTitle);
        }
    }
}

FilterTag.propTypes = {
    title: PropTypes.string.isRequired,
    subFilterTitle: PropTypes.string.isRequired
};
