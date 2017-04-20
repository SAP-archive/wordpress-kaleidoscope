require("!style!raw!sass!./detailBubble.scss");
import React from "react";
import AppStore from '../../stores/AppStore';

export default class DetailBubble extends React.Component {
    render () {
    	return (
   			<div className="detailview__content__bubble gr-12">
                <div className={`detailview__content__bubble__bg ${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)}`}>
                	{this.props.children}
                </div>
            </div>
        )
    }
}
