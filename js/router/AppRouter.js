import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';

import Actions from '../actions/Actions';
import { ActionTypes } from '../constants/constants';

import AppStore from '../stores/AppStore';


// AppRouter
// 1. trigger actions when history is changed by browser
// 2. update history when navigation events occur
// 3. check for url params to configure the app
var backlink = null;

class AppRouter extends EventEmitter {
    constructor(props) {
        super(props);

        this.pushState = !(typeof history.pushState === 'undefined');
        this.onpopstate = this.onpopstate.bind(this);
        window.addEventListener('popstate', this.onpopstate)

        AppDispatcher.register((action) => {
            if (!this.pushState) {
                return;
            }
            let nextPath = '/';
            let search = window.location.search;

            switch (action.actionType) {

                case ActionTypes.INIT_DETAIL_VIEW:
                    nextPath = action.project.slug;
                    if(!AppStore.isOniPadApp()) { //prohibit history manipulation in case of being displayed within an iOS app (not safari)
                        history.pushState({}, `ICN Portfolio - ${action.project.title}`, nextPath + search);
                    }
                    break;

                case ActionTypes.EXIT_DETAIL_VIEW:
                    if(!AppStore.isOniPadApp())  { //prohibit history manipulation in case of being displayed within an iOS app (not safari)
                        history.pushState({}, `ICN Portfolio - Overview`, nextPath + search);
                    }
                    break;

                case ActionTypes.BACK_TO_OVERVIEW:
                  location.assign(backlink);
                  break;

                default:
                    // do nothing
            }
        });

        // check for url params
        let urlParams = document.location.search.substring(1);
        let aParams = urlParams.split("&");
        let lockedFilters = [];
        aParams.forEach(function(item, index) {
            if (item) {
                var aItem = item.split("=");
                if (aItem[0].toLowerCase() === "public") {
                    try {
                        localStorage.setItem('locked', aItem[1]);
                    } catch(e) {
                        console.log(e);
                    }
                } else if (aItem[0].toLowerCase() === "search") {
                    let sDecoded = decodeURIComponent(aItem[1]);
                    Actions.trigger(ActionTypes.PERFORM_SEARCH, sDecoded);
                } else if (aItem[0].toLowerCase() === "overview") {
                    aItem[1] = decodeURIComponent(aItem[1]);
                    var overViewArray = aItem[1].split("|");
                    var aOverViewData = [];
                    AppStore.setOverview(true);
                    for (var i = 0; i < overViewArray.length; i += 4) {
                        aOverViewData.push({
                                title: decodeURIComponent(overViewArray[i]),
                                url: decodeURIComponent(overViewArray[i + 1]),
                                logo: decodeURIComponent(overViewArray[i + 2]),
                                description: decodeURIComponent(overViewArray[i + 3]),
                                overviewParticle: true
                        });
                    }
                    AppStore.setOverviewData(aOverViewData);

                } else if (aItem[0].toLowerCase() === "screensaver") {
                    AppStore.setScreenSaverMode(true);
                    AppStore.setScreenSaverActive(true);
                    backlink = "?" + urlParams;
                } else if(aItem[0].toLowerCase() === 'accessiblemode') {
                    AppStore.setAccessibleMode(true);
                    backlink = "?" + urlParams;
                } else if (aItem[0].toLowerCase() === "backlink"){
                  backlink = decodeURIComponent(aItem[1]);
                } else {
                    if (aItem[1]) {
                        let sDecoded = decodeURIComponent(aItem[1]);
                        let aValues = sDecoded.split(",");
                        aValues.forEach(function(filterItem, index) {
                            if (filterItem) {
                                lockedFilters.push({ filterTitle: decodeURIComponent(aItem[0]).replace(/___/g, ' '), subFilter: filterItem.trim() });
                            }
                        });
                    }
                }
            }
        });
        if (lockedFilters.length > 0) {
            let lastElement = lockedFilters.splice(-1);
            AppStore.setLockedFilters(lockedFilters);
            AppStore.setFilterOverview(false);
            Actions.trigger(ActionTypes.SWITCH_SUB_FILTER, lastElement[0].filterTitle, lastElement[0].subFilter);
        }

        // update app to the currently loaded url
        setTimeout(this.onpopstate, 0);
    }

    onpopstate(event) {
        let nextPath = document.location.pathname;

        window.kioskMode = false;
        if (nextPath === '/') {
            //    Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW); //reset url path filter in url will deleted
        } else if (nextPath === '/about'){
            Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, AppStore.getAboutProject());
        } else {
            let project = AppStore.getProjectFromSlug(nextPath.replace('/', ''));
            if(project) {
              Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, project);
            }
        }
    }

    getBacklink(){
      return backlink;
    }
}

export default new AppRouter();
