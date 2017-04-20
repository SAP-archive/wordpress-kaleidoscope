import "!style!raw!sass!./backlink.scss"
import React from "react";
import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

export default class Backlink extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {

        if (this.props.link){
          return (
              <img src={window.icnThemePath + 'img/back_black.svg'} className="backlink__linkicon"  onClick={this.onClick.bind(this)} />
          );
        } else {
          return (null);
        }

    }

    onClick(event) {
        if(this.props.link == 'screensaver') {
            Actions.trigger(ActionTypes.SHOW_SCREENSAVER);
            return;
        }
      Actions.trigger(ActionTypes.BACK_TO_OVERVIEW);
    }
}
