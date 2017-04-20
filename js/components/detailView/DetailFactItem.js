import React from "react";
import AppStore from '../../stores/AppStore';
require("!style!raw!sass!./detailFactItem.scss");

var Isvg = require('react-inlinesvg');

export default class DetailFactItem extends React.Component {

    render() {

        let icon = this.props.icon || "../../../../img/icon_dates.svg";

        let style = {
            width: '48px',
            height: '48px'
        }

        return (
            <div className={`detailview__fact__bubble ${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)} row`}>
                        <div className="gr-2 detailview__fact__bubbleIcon" >
                          <Isvg src={icon} />
                        </div>
                        <div className="detailview__fact__bubble__text gr-9">
                            {this.props.children}
                        </div>
                    </div>
        );
    }
}
