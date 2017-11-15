import './filters.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from '../../stores/AppStore';

import MainFilter from './MainFilter';
import Lock from "../lock/Lock";
import Search from '../search/Search';


export default class Filters extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mounted: false };
        this.onClear = this.onClear.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickFilterMenuButton = this.onClickFilterMenuButton.bind(this);
        this.onKeyDownFilterMenuButton = this.onKeyDownFilterMenuButton.bind(this);
        this.onFilterContainerAnimationEnd = this.onFilterContainerAnimationEnd.bind(this);
        this.onToggleSearch = this.onToggleSearch.bind(this);
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

        let iconStyles = {
            display: this.props.project ? 'none' : (window.portfolio_showSearchButton ? 'block' : 'none')
        };

        let filtersContainerStyle = {
            visibility: AppStore.isSearching() ? "hidden" : "visible"
        }

        let filterButtonClass = this.props.overview || AppStore.isSearching() ? "" : "closing";
        let searchButtonClass = AppStore.isSearching() ? "closing" : "";

        return (
            <div className={`filters ${classes}`}  onClick={this.onClick}>
                {(() => {
                    if (!window.portfolio_lockSidebar) {
                        return (
                            <div className={`filter-menu-button animated_button ${filterButtonClass}`}
                                 onKeyDown={this.onKeyDownFilterMenuButton}
                                 onClick={this.onClickFilterMenuButton}>
                                {window.portfolio_filter_button_caption}
                            </div>
                        )
                    }
                })()}              
                <div className="filters__container" style={filtersContainerStyle} 
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
                {(() => {
                    if (window.portfolio_showMatrixButton) {
                        return (
                                <div 
                                    className = "matrix__button animated_button" 
                                    onClick = { this.onToggleMatrix }>
                                    MATRIX
                                    </div>
                            )
                    }
                })()}
                <div
                style = { iconStyles }
                className = {`search__icon animated_button ${searchButtonClass}`}
                onClick = { this.onToggleSearch }
                >SEARCH
                </div>
                <Search project={this.state.currentProject} searchTerm={this.state.searchTerm} />

                <div className="filters__gradient filters__container"/>
                {aboutButtonLarge}
                {lock}
                {sapLogo}
                {icnLogo}
            </div>
        );
    }
    onFilterContainerAnimationEnd(event) {
        /*
        if(event.propertyName === 'opacity') {
            if(window.getComputedStyle(event.target)[event.propertyName] == 0) {
                event.target.style.display = 'none';
            }
        }
        */
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
            if (AppStore.isSearching()) {
                Actions.trigger(ActionTypes.TOGGLE_SEARCH); 
            } else {
                Actions.trigger(ActionTypes.TOGGLE_FILTER, !this.props.overview);
            }
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


    onToggleSearch(e) {
        if (e.shiftKey) {
            Actions.trigger(ActionTypes.TOGGLE_MATRIX);
        } else {
            Actions.trigger(ActionTypes.TOGGLE_SEARCH);
            if (AppStore.isSearching()) {
                Actions.trigger(ActionTypes.TOGGLE_FILTER, !this.props.overview);
            }
        }
    }

    onToggleMatrix(e) {
        Actions.trigger(ActionTypes.TOGGLE_MATRIX);
    }

}
