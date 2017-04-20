import './filters.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from '../../stores/AppStore';

import MainFilter from './MainFilter';
import Lock from "../lock/Lock";


export default class Filters extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mounted: false };
        this.onClear = this.onClear.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickFilterMenuButton = this.onClickFilterMenuButton.bind(this);
        this.onKeyDownFilterMenuButton = this.onKeyDownFilterMenuButton.bind(this);
        this.onFilterContainerAnimationEnd = this.onFilterContainerAnimationEnd.bind(this);
    }

    componentDidMount() {
        setTimeout(() => this.setState({mounted: true}), 100);
    }

    render() {
        let classes = '';
        if (!window.portfolio_lockSidebar && (this.props.overview || this.props.blur)) {
            classes += 'filters__overview';
        }
        if (!window.portfolio_lockSidebar && (!this.state.mounted || this.props.hideFilters)) {
            classes += ' filtersHidden '
        } else {
            classes += ' filtersShown '
        }

        var lock;
        if (window.lockEnabled) {
            lock = <Lock locked={this.props.locked}/>;
        }

        var icnLogo;
        var filtersContainerClass = 'filters__container';
        let icnLogoStyles = {}
        if (!window.portfolio_showSapLogo) {
            // move the logo to the left if the SAP logo is not shown
            icnLogoStyles = { left: "10px" };
        }
        if (!this.props.overview && this.props.showCredit) {
            classes += "icnCreditVisible"
            icnLogo = <img  id="icn"
                            src={window.icnThemePath + 'img/icn_logo_white.svg'}
                            alt="ICN"
                            style={icnLogoStyles} />;
        }

        let styles = {
            position: 'fixed',
            top: '15px',
            left: '10px',
            width: 'auto',
            cursor: 'pointer'
        }

        let logoClass = window.portfolio_logo_right ? 'filterLogoRight' : 'filterLogo';

        var headerLogo = <img id="icnLogo"
                              alt="Innovation Center Network"
                              src={window.portfolioLogoPath}
                              className={logoClass}
                              onClick={this.onClickReload}/>

        var aboutButtonLarge;
        let aboutButtonStyles = {};
        if (AppStore.getAboutProject()) {
            var sTitle = AppStore.getAboutProject().aboutTitle;
            if (!window.portfolio_showSapLogo) {
                // move the logo to the right if the SAP logo is not shown
                aboutButtonStyles = { left: "10px !important" };
            }
            aboutButtonLarge = <div className="filterAboutButton filterAboutButtonLarge" style={aboutButtonStyles} onClick={this.onAbout}><span>{sTitle}</span></div>;
        }

        let sapLogo = <img src={window.icnThemePath + 'img/logo_gray.svg'} alt="SAP" id="sapLogo" className="filterSapLogo"/>;
        if (!window.portfolio_showSapLogo) {
            sapLogo = null;
        }
        if(document.getElementById('filters_container') && classes.indexOf("filters__overview") < 0) {
            document.getElementById('filters_container').style.display = 'block';
        }
        return (
            <div className={`filters ${classes}`}  onClick={this.onClick}>
                {headerLogo}
                {(() => {
                    if (!window.portfolio_lockSidebar) {
                        return (
                            <div>
                                <a tabIndex="1" className="filterMenuButton"
                                   onKeyDown={this.onKeyDownFilterMenuButton}
                                   onClick={this.onClickFilterMenuButton}>≡</a>
                                <span className="filterText"><span>{window.portfolio_filter_button_caption}</span></span>
                            </div>
                        )
                    }
                })()}
                <div className="filters__container"
                     onTransitionEnd={this.onFilterContainerAnimationEnd}
                     id="filters_container">
                    {
                        AppStore.getFilterTypes().map((filter, index) => {
                            return (
                                <MainFilter key={index}
                                            title={filter}
                                            isActive={AppStore.getActiveFilterTypes()[index]}
                                            filter={this.props.filters[filter]}
                                            lockedFilters={this.props.lockedFilters}
                                            selectedFilters={this.props.selectedFilters}/>
                            );
                        })
                    }
                </div>
                {aboutButtonLarge}
                {lock}
                {sapLogo}
                {icnLogo}
            </div>
        );
    }
    onFilterContainerAnimationEnd(event) {
        if(event.propertyName === 'opacity') {
            if(window.getComputedStyle(event.target)[event.propertyName] == 0) {
                event.target.style.display = 'none';
            }
        }
    }

    onKeyDownFilterMenuButton(event) {
        //Enter or Space
        if(event.key === 'Enter' || event.keyCode == 32) {
            this.onClickFilterMenuButton(event);
        } else if(event.keyCode === 27 && !window.portfolio_lockSidebar) {
            Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
        }
    }
    onClickFilterMenuButton(oEvent) {
        oEvent.stopPropagation();
        if (!window.portfolio_lockSidebar) {
            Actions.trigger(ActionTypes.TOGGLE_FILTER, !this.props.overview);
        }
        if (AppStore.getLockedFilters().length === 0) {
            Actions.trigger(ActionTypes.CLEAR_FILTERS);
        }
    }
    onAbout(oEvent) {
        oEvent.stopPropagation();
        if (AppStore.getAboutProject()) {
            Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, AppStore.getAboutProject());
        }
    }
    onClickReload(event) {
        if (!AppStore.getFilterOverview()) {
            window.location.reload();
        }
    }
    onClear(oEvent) {
        let that = this;

        oEvent.stopPropagation();
        if (!window.portfolio_lockSidebar) {
            if (AppStore.getLockedFilters().length === 0) {
                Actions.trigger(ActionTypes.TOGGLE_FILTER, !that.props.overview);
            } else {
                Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
            }
        }
        Actions.trigger(ActionTypes.CLEAR_FILTERS);


    }

    onClick(oEvent) {
        if (this.props.overview && !window.portfolio_lockSidebar) {
            Actions.trigger(ActionTypes.TOGGLE_FILTER, false);
        }
        if(this.props.overview) {
            document.getElementById('filters_container').style.display = 'block';
        }
    }
}
