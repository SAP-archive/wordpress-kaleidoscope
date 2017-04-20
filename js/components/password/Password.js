import './password.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

import AppStore from "../../stores/AppStore";



export default class Password extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            passwordTerm: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onPasswordSubmit = this.onPasswordSubmit.bind(this);
    }

    componentDidUpdate () {
        this.refs.search.focus();
    }

    render () {
        let styles = {
            display: this.props.showPassword ? 'block' : 'none'
        };

        return (
            <div className="password">
                <div className="password__box" style={styles}>
                    <form onSubmit={this.onPasswordSubmit} className="password__box-form">

                        <input  className="password__box-input"
                                type="password"
                                ref="search"
                                value={this.state.passwordTerm}
                                onChange={this.onChange}
                                placeholder="Password" />

                        <input type="submit" className="password__box-form-submit" value="Search" />
                    </form>
                    <span className="password__box-close" onClick={this.onExit}>&times;</span>
                </div>
            </div>
        );
    }


    onChange (event) {
        this.setState({passwordTerm: event.target.value});
    }


    onExit () {
        this.setState({passwordTerm: ''})
        Actions.trigger(ActionTypes.TOGGLE_PASSWORD);
    }

    onPasswordSubmit (event) {
        event.preventDefault();

        if (this.state.passwordTerm === window.portfolio_kiosk_password) {
            Actions.trigger(ActionTypes.SWITCH_LOCK);
        }
    }
}
