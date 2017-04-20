require("!style!raw!sass!./detailFooter.scss");
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from '../../stores/AppStore';

var Isvg = require('react-inlinesvg');

export default class DetailFooter extends React.Component {
    render() {
        return (
            <div
                className={`detailview__footer ${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)} gr-12`}>
                <div className="detailview__footer__entry detailview__footer__entry__left gr-4 prefix-1"
                     onClick={this.onExit}>
                    <Isvg src={window.icnThemePath + 'img/back.svg'}/>
                    <span className="detailview__footer__text"><b>{AppStore.getTranslation('back', 'back to overview')}</b></span>
                </div>
                <div onClick={this.props.scrollToTop}
                     className="detailview__footer__entry detailview__footer__entry__center gr-3 suffix-4">
                    <Isvg src={window.icnThemePath + 'img/up.svg'}/>
                    <span className="detailview__footer__text">{AppStore.getTranslation('top','to the top')}</span>
                </div>
            </div>
        )
    }

    onExit() {
        Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
    }
}
