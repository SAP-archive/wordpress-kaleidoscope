import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';
import { ActionTypes, AnimationTimes } from '../constants/constants';
import Actions from "../actions/Actions";


// data
import { projects, aboutProject, filters, particleScroller, filterTypes, portfolioCategories, activeFilterType } from './projects';
let currentProject = null;


// filters & searching & matrix view
let matrix_detailview=false;
let bubble_or_text = true;
let matrixIsVisible = false;
let screenSaverMode = false;
let blur = false;
let blackBlur = true;
let showPassword = false;
let hideFilters = false;
let searching = false;
var feedbacking = false;
let searchTerm = '';
let currentFilter = null;
let lockedFilters = [];
let showNoResults = false;
let _iScroll = null;
let filterOverview = true; //true = filters not visible
let feedbackUrl = window.feedbackUrl;
let feedbackObject = {};
if (window.portfolio_lockSidebar) {
    Actions.trigger(ActionTypes.TOGGLE_FILTER, false);
}
let overview = false;
let overviewData = [];
let screenSaverActive = false;
let isVideoPlaying = false;
let backlink = null;
let animate_screensaver = false;
let accessibleMode = false;
let detailview=false;

class AppStore extends EventEmitter {
    constructor(props) {
        super(props);
        AppDispatcher.register((action) => {
            let index = -1;
            var that = this;

            switch (action.actionType) {

                case ActionTypes.INIT_DETAIL_VIEW:
                    projects.resetAnimations();
                    if (action.project){
                      action.project.animation = 'particle_opened';
                    }
                    particleScroller.animation = 'particles_opened';

                    setTimeout(function() {
                        Actions.trigger(ActionTypes.SHOW_DETAIL_VIEW, action.project);
                    }, AnimationTimes.SHOW_DETAIL_VIEW);

                    hideFilters = true;
                    this.emit("change");
                    break;

                case ActionTypes.SHOW_DETAIL_VIEW:
                    detailview = true;
                    blur = true;
                    blackBlur = false;
                    currentProject = action.project;
                    this.emit("change");
                    break;

                case ActionTypes.SET_SINGLE_FILTER:
                  let singleFilter = action.filterName;
                  // set all other filters to false, toggle single filter
                  for (let i=0; i<filterTypes.length; i++){
                    if (singleFilter === filterTypes[i]){
                      activeFilterType[i] = !activeFilterType[i];
                    } else {
                      activeFilterType[i] = false;
                    }
                  }
                  this.emit("change");
                  break;

                case ActionTypes.EXIT_DETAIL_VIEW:
                    detailview = false;
                    if (currentProject) {
                        projects.resetAnimations();
                        currentProject.animation = 'particle_closed';
                        particleScroller.animation = 'particles_closed'
                    }
                    currentProject = null;
                    hideFilters = false;
                    blur = false;
                    blackBlur = true;
                    isVideoPlaying = false;
                    this.emit("change");
                    break;
                case ActionTypes.SHOW_MATRIX_DETAIL_VIEW:
                    matrix_detailview=true;
                    Actions.trigger(ActionTypes.TOGGLE_MATRIX);
                    Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, action.project);
                    this.emit("change");
                    break;

                case ActionTypes.EXIT_MATRIX_DETAIL_VIEW:
                    matrix_detailview=false;
                    Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
                    Actions.trigger(ActionTypes.TOGGLE_MATRIX);
                    this.emit("change");
                    break;

                case ActionTypes.EXIT_SEARCH_VIEW:
                    searching = false;
                    hideFilters = false;
                    blur = false;
                    this.emit("change");
                    document.activeElement.blur();
                    break;
                case ActionTypes.EXIT_PASSWORD:
                    showPassword = false;
                    hideFilters = false;
                    blur = false;
                    this.emit("change");
                    document.activeElement.blur();
                    break;
                case ActionTypes.EXIT_MATRIX_VIEW:
                    matrixIsVisible = false;
                    blur = false;
                   // hideFilters = false;
                    this.emit('change');
                    document.activeElement.blur();
                    break;

                case ActionTypes.TOGGLE_MATRIX:
                    matrixIsVisible = !matrixIsVisible;
                    blur = matrixIsVisible;
                    blackBlur = matrixIsVisible;
                    hideFilters = matrixIsVisible;
                    this.emit('change');
                    Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
                    document.activeElement.blur();
                    break;

                case ActionTypes.SHOW_SCREENSAVER:
                    screenSaverActive = true;
                    this.emit('change');
                    break;

                case ActionTypes.ANIMATE_SCREENSAVER:
                    animate_screensaver = true;
                    this.emit('change');
                    break;


                case ActionTypes.TOGGLE_BUBBLE:
                    bubble_or_text = !bubble_or_text;
                    this.emit('change');
                    break;

                case ActionTypes.TOGGLE_SEARCH:
                    searching = !searching;
                    /*
                    blur = searching;
                    blackBlur = searching;
                    hideFilters = searching;
                    */
                    this.emit('change');
                    document.activeElement.blur();
                    break;

                case ActionTypes.TOGGLE_FEEDBACK:
                    feedbackObject = action.feedbackObject ? action.feedbackObject : {};
                    feedbacking = !feedbacking;
                    if (document.getElementsByClassName("detailviewWrapper")[0]) {
                        document.getElementsByClassName("detailviewWrapper")[0].style.display = feedbacking ? 'none' : 'block';
                    }
                    let oToast = document.getElementsByClassName("kaleidoscope_toast");
                    oToast[0].style.display = "none";
                    oToast[0].classList.toggle("dark_toast");
                    oToast[0].classList.toggle("light_toast");
                    blur = feedbacking || detailview;
                    blackBlur = feedbacking;
                    hideFilters = feedbacking || (currentProject !== null);
                    this.emit('change');
                    break;

                case ActionTypes.EXIT_FEEDBACK_VIEW:
                    feedbacking = false;
                    hideFilters = false;
                    blur = detailview;
                    blackBlur = false;
                    this.emit("change");
                    document.activeElement.blur();
                    document.getElementsByClassName("feedback-headline-email")[0].value = ("");
                    document.getElementsByClassName("feedback-headline-message")[0].value = ("");
                    break;
                case ActionTypes.TOGGLE_PASSWORD:
                    showPassword = !showPassword;
                    blur = showPassword;
                    blackBlur = showPassword;
                    hideFilters = showPassword;
                    this.emit('change');
                    break;

                case ActionTypes.NORESULTS_TRUE:
                    showNoResults = true;
                    hideFilters = (currentProject !== null) || false;
                    this.emit('change');
                    break;

                case ActionTypes.NORESULTS_FALSE:
                    showNoResults = false;
                    hideFilters = (currentProject !== null) || false;
                    this.emit('change');
                    break;

                case ActionTypes.PERFORM_SEARCH:
                    let oldSearch = searchTerm.length;

                    searchTerm = action.searchTerm;
                    if (searchTerm.length > 0) {
                        var searchFilter = { filterTitle: 'search', subFilter: `search: ${searchTerm}` };
                        lockedFilters = lockedFilters.filter(function(x) {
                            return x.filterTitle != "search"
                        });
                        lockedFilters.push(searchFilter);

                        this.emit('change');
                        setTimeout(() => {
                            let visibleProjects = projects.performSubFilterSwitch(lockedFilters);
                            projects.reorgProjects(visibleProjects, this.getIScroll());
                            this.emit('change');
                        }, 400);
                    } else {
                        if (oldSearch) {
                            Actions.trigger(ActionTypes.CLEAR_FILTERS);
                        }
                        Actions.trigger(ActionTypes.TOGGLE_FILTER);
                    }
                    break;


                case ActionTypes.SWITCH_LOCK:
                    let locked = localStorage.getItem('locked') === 'true';
                    try {
                        localStorage.setItem('locked', !locked);
                        localStorage.setItem('justSwitchedLock', true);
                    } catch(e) {
                        console.log(e);
                    }
                    blur = true;
                    hideFilters = true;
                    Actions.trigger(ActionTypes.TOGGLE_PASSWORD);
                    break;


                case ActionTypes.SWITCH_SUB_FILTER:
                    // reset searchTerm when clearing search
                    if (action.filterTitle === 'search') {
                        searchTerm = '';
                    }
                    lockedFilters.find(function(filter, i) {
                        if (filter.filterTitle === action.filterTitle && filter.subFilter === action.subFilter ||
                            filter.filterTitle === action.filterTitle && window.portfolio_filterAsRadioButtons) {
                            index = i;
                            return true;
                        }
                        return false;
                    });

                    if (index === -1) {
                      // add filter
                        lockedFilters.push({ filterTitle: action.filterTitle, subFilter: action.subFilter });
                    } else {
                        if(window.portfolio_filterAsRadioButtons) {
                            // remove filter
                            // lockedFilters.splice(index, 1);

                            // remove identical filter
                            if (lockedFilters[index].filterTitle === action.filterTitle && lockedFilters[index].subFilter === action.subFilter){
                              lockedFilters.splice(index, 1);
                            } else {
                                // replace filter
                                lockedFilters[index] = {filterTitle: action.filterTitle, subFilter: action.subFilter};
                            }
                        } else {
                            lockedFilters.splice(index, 1);
                        }
                    }

                    if (lockedFilters.length > 0) {
                        let visibleProjects = projects.performSubFilterSwitch(lockedFilters);
                        projects.reorgProjects(visibleProjects, that.getIScroll());
                        if (visibleProjects.length > 0) {
                            Actions.trigger(ActionTypes.NORESULTS_FALSE);
                        } else {
                            Actions.trigger(ActionTypes.NORESULTS_TRUE);
                        }
                        that.emit('change');
                        break;
                    }
                    // ATTENTION INTENTIONAL NO break;
                case ActionTypes.CLEAR_FILTERS:
                    blur = feedbacking || currentProject ? true : false || false;
                    searchTerm = '';
                    currentFilter = null;
                    lockedFilters = [];
                    //Actions.trigger(ActionTypes.TOGGLE_FILTER);
                    projects.resetFilters(filterOverview, that.getIScroll());
                    Actions.trigger(ActionTypes.NORESULTS_FALSE);
                    Actions.trigger(ActionTypes.TOGGLE_FILTER);
                    this.emit('change');
                    break;
                case ActionTypes.TOGGLE_FILTER:
                    if (typeof action.filterOverview !== 'undefined') {
                        filterOverview = action.filterOverview;
                    }
                    let scroller = that.getIScroll();
                    var initialScrollMax = scroller.maxScrollY;

                    var initialScrollPercent = (scroller.y / scroller.maxScrollY);
                    if (isNaN(scroller.y) || scroller.maxScrollY == 0) {
                        initialScrollPercent = 0;
                    }
                    
                    that.emit('change');
                    setTimeout(function() {
                        if (lockedFilters.length > 0) {
                            let visibleProjects = projects.performSubFilterSwitch(lockedFilters);
                            projects.reorgProjects(visibleProjects, that.getIScroll());
                        } else {
                            projects.alignProjectsToFilterBar(that.getIScroll(), filterOverview);
                        }
                        that.emit('change');
                    }, 400);

                    setTimeout(function() {
                        let filterOffset = 0;
                        let filterNodes = document.getElementsByClassName("filters");
                        let scrollMax = scroller.maxScrollY;
                        let scrollY = (initialScrollPercent * (scroller.maxScrollY));
                        let bottomScrollThreshold = (window.innerHeight > window.innerWidth) ? 0.9 : 0.95;
                        if (initialScrollMax > scrollMax) {
                            if (initialScrollPercent >= bottomScrollThreshold) {
                                scrollY = bottomScrollThreshold * (scroller.maxScrollY);
                            }
                        }
                        if(window.portfolio_lockSidebar) {
                            //Get initial (and correct!) iScroller y-Position at startup. 2 x split is necessary due to
                            //the fact that the y-Position is nested in css-transform statement.
                            scrollY = parseFloat(document.getElementsByClassName("particles__inner")[0].style.transform.split(",")[1].split(")")[0]);
                        }
                        scroller.scrollTo(0, scrollY, 200);
                    }, 500); 
                    break;

                case ActionTypes.COPY_LINK:

                    let urlParams = document.location.search.substring(1);
                    let aParams = urlParams.split("&");
                    let backlinkParam = "";
                    backlinkParam = aParams.find((param) => {
                        return param.startsWith("backlink");
                    });

                    var sLink = document.location.origin + "/?";
                    if (backlinkParam){
                        sLink += backlinkParam;
                    }

                    var oFilterDict = {};
                    this.getLockedFilters().forEach(function(item) {
                        if (item && item.filterTitle) {

                            if (item.filterTitle in oFilterDict) {
                                if (item.filterTitle === "search") {
                                    oFilterDict[item.filterTitle].push(item.subFilter.replace(/search: /, ''));
                                } else {
                                    oFilterDict[item.filterTitle].push(item.subFilter)
                                }
                            } else {
                                if (item.filterTitle === "search") {
                                    oFilterDict[item.filterTitle] = [item.subFilter.replace(/search: /, '')];
                                } else {
                                    oFilterDict[item.filterTitle] = [item.subFilter];
                                }
                            }
                        }
                    });
                    let nParameterIndex = 0;
                    for (var key in oFilterDict) {
                        if (oFilterDict.hasOwnProperty(key)) {
                            if (backlinkParam || nParameterIndex > 0) {
                                sLink += "&"
                            }
                            nParameterIndex++;
                            sLink += key.replace(/ /g, '___') + "=" + encodeURIComponent(oFilterDict[key].join(","));
                        }
                    }

                    var textArea = document.createElement("textarea");
                    textArea.value = sLink;
                    document.body.appendChild(textArea);
                    textArea.select();
                    let result = document.execCommand('copy');
                    oToast = document.getElementsByClassName("kaleidoscope_toast");
                    if (result) {
                        oToast[0].innerText = "Copied link to clipboard"
                    } else {
                        oToast[0].innerText = "Copied link to clipboard failed"
                    }
                    setTimeout(() => oToast[0].style.display = "none", 3700);
                    oToast[0].style.display = "block";
                    document.body.removeChild(textArea);
                    break;
                case ActionTypes.CONTACT_ALL: 
                    let visibleProjects = projects.performSubFilterSwitch(lockedFilters);
                    var emailOut = visibleProjects.map(function(x) {
                        return icnAllProjects[x].contact_person.map(function(e) { 
                            return e.contact_email; 
                        });
                    }).reduce(function(acc,val) {
                        return acc.concat(val);
                    }).filter(function(value, index, self){
                        return self.indexOf(value) === index;
                    }).join(";");

                    window.open("mailto:"+emailOut);
                    // for (var i in visibleProjects) {
                    //     emailOut += icnAllProjects[i].contact_person.map(function(e) { return e.contact_email; }).join(";") 
                    // }
                    break;
                case ActionTypes.CHECK_EMAIL:
                    oToast = document.getElementsByClassName("kaleidoscope_toast");
                    oToast[0].innerText = "Please provide a valid e-mail address";
                    setTimeout(() => oToast[0].style.display = "none", 3700);
                    oToast[0].style.display = "block";
                    break;

                case ActionTypes.RESIZE:
                    projects.initParticles();
                    Actions.trigger(ActionTypes.TOGGLE_FILTER);
                    this.emit('change');
                    break;

                default:
                    // do nothing
            }
        });
    }

    setIScroll(iScroll) {
        _iScroll = iScroll;
    }
    getIScroll() {
        return _iScroll;
    }
    getFilters() {
        return filters;
    }

    getFilterTypes() {
        return filterTypes;
    }
    getActiveFilterTypes() {
        return activeFilterType;
    }

    getProjects() {
        return projects;
    }
    getProjectByTitle(p_title){
        let active_projects = {};
        if(Object.getOwnPropertyNames(projects).length!==0){
            active_projects = projects.filter(function(obj){
            return (obj.title == p_title)
        });
        }
        return active_projects;
    }
    getAboutProject() {
        return aboutProject;
    }

    getCurrentProject() {
        return currentProject;
    }

    isOniPadApp() {
      var standalone = window.navigator.standalone,
          userAgent = window.navigator.userAgent.toLowerCase(),
          safari = /safari/.test( userAgent ),
          ios = /iphone|ipod|ipad/.test( userAgent );
      if(ios && !standalone && !safari) { //check if content is displayed in UIWebView => inside an iOS app, NOT in safari
        return true;
      } else {
        return false;
      }
    }


    getFeedbackUrl() {
        return feedbackUrl;
    }
    getFeedbackObject() {
        return feedbackObject;
    }
    setFeedbackObject(newFeedbackObject) {
        feedbackObject = newFeedbackObject;
    }
    getIsVideoPlaying() {
        return isVideoPlaying;
    }
    setIsVideoPlaying(bStatus) {
        isVideoPlaying = bStatus;
    }
    getScreenSaverMode() {
        return screenSaverMode;
    }
    setScreenSaverMode(bool) {
        screenSaverMode = bool;
    }
    getOverview() {
        return overview;
    }
    setOverview(bool) {
        overview = bool;
    }
    getOverviewData() {
        return overviewData;
    }
    setOverviewData(newOverViewData) {
        overviewData = newOverViewData;
    }
    getScreenSaverActive() {
        return screenSaverActive;
    }
    setAccessibleMode(bool) {
        accessibleMode = bool;
    }
    getAccessibleMode() {
        return accessibleMode;
    }
    setScreenSaverActive(bool) {
        screenSaverActive = bool;
    }

    setBacklink(link){
      backlink = link;
    }

    getBacklink(){
      return backlink;
    }

    getLockedFilters() {
        return lockedFilters;
    }
    setLockedFilters(lockedFilterParam) {
        lockedFilters = lockedFilterParam;;
    }
    isMatrix_DetailView(){
        return matrix_detailview;
    }

    matrixIsVisible(){
        return matrixIsVisible;
    }
    isBubble_Or_Text(){
        return bubble_or_text;
    }

    isSearching() {
        return searching;
    }

    isFeedbacking() {
        return feedbacking;
    }

    isLocked() {
        return localStorage.getItem('locked') === 'true';
    }

    getSearchTerm() {
        return searchTerm;
    }
    getFilterOverview() {
        return filterOverview;
    }
    setFilterOverview(bStatus) {
        filterOverview = bStatus;
    }

    isAnimateScreensaver(){
      return animate_screensaver;
    }

    setAnimateScreenSaver(doAnimateScreensaver){
      animate_screensaver = doAnimateScreensaver;
    }

    getBlur() {
        return blur;
    }

    getBlackBlur() {
        return blackBlur;
    }

    getShowPassword() {
        return showPassword;
    }

    getHideFilters() {
        return hideFilters;
    }

    getParticleScroller() {
        return particleScroller;
    }

    getShowNoResults() {
        return showNoResults;
    }

    getProjectFromSlug(slug) {
        return projects.find(function(project) {
            return project.slug === slug;
        });
    }

    getPortfolioCategory(project) {
        let portfolio = project;
        if (project[window.portfolio_coloredByElement]) {
            portfolio = project[window.portfolio_coloredByElement][0];
        }
        if (!portfolio || typeof portfolio !== 'string') {
            return 'category_00';
        }
        var foo = portfolioCategories;
        return portfolioCategories[portfolio.toLowerCase().replace(/\W/g, '')];
    }

    getTranslation(label, defaultValue) {
        if (typeof label !== 'string') return undefined;
        return typeof window.detailCaptions[label.toUpperCase()] === 'string' ?
            window.detailCaptions[label.toUpperCase()] : defaultValue;
    }

    getFilterDescription(filter) {
        return window.mainFilters.reduce((prev, curr) => {
            var items = curr.items;
            if (typeof items === 'object' && !Array.isArray(items)) {
                for (var attr in items) {
                    prev[attr] = items[attr];
                }
            }
            return prev;
        }, {})[filter];
    }
}

export default new AppStore();