import './lock.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";


export default class Lock extends React.Component {

    constructor (props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render () {
        let imgSrc = `${window.icnThemePath}img/${this.props.locked ? 'locked' : 'unlocked'}.svg`;
        let style = {
            display: window.portfolio_kiosk_password.length > 0 ? 'inherit' : 'none'
        };
        return (
            <div className="lock" onClick={this.onClick} style={style}>
                <span>{this.props.locked ? 'kiosk' : 'regular'}</span>
            </div>
        );
    }

    onClick () {
        Actions.trigger(ActionTypes.TOGGLE_PASSWORD);
    }
}
