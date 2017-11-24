require("!style!raw!sass!./app.scss");
require('core-js');

import React from 'react';
import { render } from 'react-dom';

import AppStore from './stores/AppStore';
import AppRouter from './router/AppRouter';
import IdleAnimation from './animation/IdleAnimation';
import Actions from "./actions/Actions";
import { ActionTypes } from "./constants/constants";

import Blur from './components/blur/Blur';
import Feedback from './components/feedback/Feedback';
import Password from './components/password/Password';
import NoResults from './components/noResults/NoResults';
import Filters from './components/filters/Filters';
import DetailView from './components/detailView/DetailView';
import ActiveFilters from './components/filters/ActiveFilters';
import ParticleScroller from './components/particlesScroller/ParticleScroller';
import Overview from './components/overview/Overview';
import ScreenSaver from './components/screensaver/ScreenSaver';
import Matrix from './components/Matrix/Matrix';
import Backlink from './components/backlink/Backlink';


class ICNPortfolioApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentProject: AppStore.getCurrentProject(),
            projects: AppStore.getProjects(),
            lockedFilters: AppStore.getLockedFilters(),
            filters: AppStore.getFilters(),
            particlesScroller: AppStore.getParticleScroller(),
            searchTerm: '',
            feedbackUrl: window.feedbackUrl,
            showCredit: window.showCredit,
            locked: AppStore.isLocked(),
            searching: false,
            hideFilters: false,
            blur: false,
            blackBlur: AppStore.getBlackBlur(),
            showPassword: false,
            showNoResults: false,
            filterOverview: AppStore.getFilterOverview(),
            overview: AppStore.getOverview(),
            screenSaver: AppStore.getScreenSaverActive(),
            accessibleMode: AppStore.getAccessibleMode()
        };
        window.invertedMode = false;

        this.onAppStoreChanged = this.onAppStoreChanged.bind(this);
    }

    handleResize(e) {
        Actions.trigger(ActionTypes.RESIZE);
        //repositioning
    }

    componentDidMount() {
        AppStore.on('change', this.onAppStoreChanged);
        window.addEventListener('resize', this.handleResize.bind(this));
        setTimeout(() => {
            if (window.kioskMode && localStorage.getItem('locked') === 'false') {
                Actions.trigger(ActionTypes.SWITCH_LOCK);
                try {
                    localStorage.setItem('locked', !locked);
                } catch(e) {
                    console.log(e);
                }
            }
        }, (window.lockTimeInSeconds !== undefined ? window.lockTimeInSeconds : 60) * 1000);

        // install link click handler callback
        document.that = this;
        document.addEventListener("mousedown", this._handleClick);
        document.addEventListener("keydown", this._handleKeyDown);
        Actions.trigger(ActionTypes.RESIZE);
    }

    componentWillUnmount() {
        AppStore.removeListener("change", this.onAppStoreChanged);
    }

    _handleKeyDown(event) {
      //  w n i j m
        if(event.ctrlKey) {
         if(localStorage.getItem('locked'))
            if (event.key === "p" || event.key === "w" || event.key === "n" || event.key === "i" || event.key === "j" || event.key === "m") { //Only allow Search, Copy and Pase
                event.preventDefault();
            }
        }

        if (event.ctrlKey && event.shiftKey && event.key === "I") {
            // CTRL - SHIFT - i  pressed
            window.invertedMode = !window.invertedMode;
            document.that.onAppStoreChanged();
        }
    }

    _handleClick(event){
      if (localStorage.getItem("locked") === "true"){
        if (event.target.tagName === "A"){
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          event.target.href="#";
          return false;
        }
      }
    }


    render() {

        var that = this; {
            const accessibleMode = this.state.accessibleMode? 'accessible-mode' : '';
            const invertedMode = window.invertedMode? 'inverted-mode' : '';
            return (() => {
                // overview page if overview param is giving via url
                if (this.state.overview) {
                    return (
                        <div id='icn_portfolio_overviewapp'>
                          <Overview
                              size={this.state.particlesScroller}
                              isIE={this.props.isIE}
                               />
                          <div className='kaleidoscope_toast animate-toast dark_toast'>Toast Message</div>
                        </div>
                    )

                } else {
                    return (
              <div id='icn_portfolio_app' className={`${accessibleMode} ${invertedMode}`}>

                {/* --- Screensaver --- */}
                {(()=>{
                  if (this.state.screenSaver){
                    return (<ScreenSaver />);
                  }
                })()}


                <img id="icnLogo"
                              alt="Innovation Center Network"
                              src={window.portfolioLogoPath}
                              className="filterLogo"
                              />
                <Backlink link={AppRouter.getBacklink()} />


                <Matrix project={this.state.currentProject} />
                
                <Feedback feedbacking={this.state.feedbacking} feedbackUrl={this.state.feedbackUrl}/>

                <Password showPassword={this.state.showPassword} />

                <DetailView projects={this.state.projects}
                            locked={this.state.locked}
                            project={this.state.currentProject}
                            isIE={this.props.isIE} />

                <Filters filters={this.state.filters}
                         lockedFilters={this.state.lockedFilters}
                         selectedFilters={this.state.selectedFilters}
                         searchTerm={this.state.searchTerm}
                         showCredit={this.state.showCredit}
                         hideFilters={this.state.hideFilters}
                         locked={this.state.locked}
                         blur={this.state.blur}
                         imgCollapsed={this.state.imgCollapsed}
                         imgExpanded={this.state.imgExpanded}
                         overview={this.state.filterOverview} />


                <ActiveFilters hideFilters={this.state.hideFilters}
                               lockedFilters={this.state.lockedFilters}
                                locked={this.state.locked}/>


                <Blur blur={this.state.blur} blackBlur={this.state.blackBlur} locked={this.state.locked}>

                    <ParticleScroller projects={this.state.projects}
                                      filters={this.state.filters}
                                      size={this.state.particlesScroller}
                                      isIE={this.props.isIE}
                                        overview={this.state.filterOverview} />

                    <NoResults showNoResults={this.state.showNoResults} />

                </Blur>


                <div className='kaleidoscope_toast animate-toast dark_toast'>Toast Message</div>
            </div>
                    );
                }
            })()
        }
    }

    onAppStoreChanged() {
        this.setState({
            currentProject: AppStore.getCurrentProject(),
            projects: AppStore.getProjects(),
            lockedFilters: AppStore.getLockedFilters(),
            filters: AppStore.getFilters(),
            particlesScroller: AppStore.getParticleScroller(),
            searchTerm: AppStore.getSearchTerm(),
            searching: AppStore.isSearching(),
            feedbacking: AppStore.isFeedbacking(),
            feedbackUrl: AppStore.getFeedbackUrl(),
            hideFilters: AppStore.getHideFilters(),
            locked: AppStore.isLocked(),
            blur: AppStore.getBlur(),
            blackBlur: AppStore.getBlackBlur(),
            showPassword: AppStore.getShowPassword(),
            showNoResults: AppStore.getShowNoResults(),
            filterOverview: AppStore.getFilterOverview(),
            overview: AppStore.getOverview()
        });
    }
}


// only allow for certain browsers
let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
    isMobileSafari = /iP(ad|od|hone)/i.test(window.navigator.userAgent) && /WebKit/i.test(window.navigator.userAgent) && !(/(CriOS|FxiOS|OPiOS|mercury)/i.test(window.navigator.userAgent)),
    isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./),
    isIEOld = !!navigator.userAgent.match(/Trident.*rv[ :]*(0?[1-9]|1[0])\./),
    isEdge = /Edge/.test(navigator.userAgent);
if(isIEOld) {
    render(
        <div style="margin: 10vh auto; width: 100%; text-align:center;">Kaleidoscope does not support Internet Explorer Versions smaller than 11!</div>,
        document.getElementById('icnPortfolio')
    );
} else {
    render(
        <ICNPortfolioApp isIE={isIE11 || isEdge}/>,
        document.getElementById('icnPortfolio')
    );
}