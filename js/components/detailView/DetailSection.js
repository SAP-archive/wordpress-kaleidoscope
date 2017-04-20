require("!style!raw!sass!./detailSection.scss");
import React from "react";

import DetailBubble from "./DetailBubble.js";

var Isvg = require('react-inlinesvg');

export default class DetailSection extends React.Component {
    render() {
        return (
            <div className="detailview__content__section">
                <div className="row">
                    <div className="gr-6 prefix-1"><h3>{this.props.title}</h3></div>
                </div>
                <div className="row">
                    <div className="gr-7 prefix-1 prefix-0@tablet gr-11@tablet prefix-0@mobile gr-11@mobile">
                        <div className="detailview__content__text gr-11 prefix-1" dangerouslySetInnerHTML={{__html:this.props.html}} />
                    </div>
                    <div className="detailview__content__img gr-3 prefix-1">
                        <DetailBubble portfolioAreaClass={this.props.portfolioAreaClass}>
                          <Isvg src={`${window.icnThemePath}img/${this.props.icon}`} uniquifyIDs={true} className="detailview__content__bubble__isvg"/>
                        </DetailBubble>
                    </div>
                </div>
            </div>
        )
    }
}
