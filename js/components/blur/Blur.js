import './blur.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

import PropTypes from 'prop-types';

export default class Blur extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleEscKey = this.handleEscKey.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keyup", this.handleEscKey);
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleEscKey);
    }

    render() {
        let blurStyles = {
            WebkitFilter: this.props.blur ? 'blur(10px)' : 'blur(0px)'
        };
        let overlayStyles = {
            display: (this.props.blur) ? 'block' : 'none',
            background: (this.props.blackBlur) ? 'rgba(0,0,0,0.8)' : 'transparent',
        };

        return (
            <div>
                <div className="blur__overlay" style={overlayStyles} onClick={this.handleClick} />
                <div className="blur" style={blurStyles}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    handleClick() {
        if (this.props.locked) return;
        window.temporarilyDisableTracking = true;
        Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
        Actions.trigger(ActionTypes.EXIT_SEARCH_VIEW);
        Actions.trigger(ActionTypes.EXIT_FEEDBACK_VIEW);
        Actions.trigger(ActionTypes.EXIT_MATRIX_VIEW);
        window.temporarilyDisableTracking = false;
        if (typeof _paq !== "undefined") {
            _paq.push(['trackEvent', "All Views", "closed"]);
        }
    }

    handleEscKey(event) {
        if (this.props.locked) return;
        if (event.keyCode === 27) {
            window.temporarilyDisableTracking = true;
            Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
            Actions.trigger(ActionTypes.EXIT_SEARCH_VIEW);
            Actions.trigger(ActionTypes.EXIT_FEEDBACK_VIEW);
            Actions.trigger(ActionTypes.EXIT_MATRIX_VIEW);
            Actions.trigger(ActionTypes.EXIT_PASSWORD);
            window.temporarilyDisableTracking = false;
            if (typeof _paq !== "undefined") {
                _paq.push(['trackEvent', "All Views", "closed"]);
            }
        }
    }
}

Blur.propTypes = {
    blur: PropTypes.bool.isRequired
};
