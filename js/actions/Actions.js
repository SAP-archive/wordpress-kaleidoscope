import AppDispatcher from "../dispatcher/AppDispatcher";
import { ActionTypes } from "../constants/constants";

let Actions = {

    EXIT_MATRIX_VIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_MATRIX_VIEW,
            data: {}
        });
    },
    SHOW_SCREENSAVER() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.SHOW_SCREENSAVER,
            data: {}
        });
    },
    ANIMATE_SCREENSAVER(){
      AppDispatcher.dispatch({
          actionType: ActionTypes.ANIMATE_SCREENSAVER,
          data: {}
      });
    },
    RESET_TIMER(){
      AppDispatcher.dispatch({
          actionType: ActionTypes.RESET_TIMER,
          data: {}
      });
    },
    TOGGLE_MATRIX() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_MATRIX,
            data: {}
        });
    },
    TOGGLE_BUBBLE() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_BUBBLE,
            data: {}
        });
    },
    TOGGLE_SEARCH() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_SEARCH,
            data: {}
        });
    },

    TOGGLE_FEEDBACK(feedbackObject) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_FEEDBACK,
            feedbackObject
        });
    },
    EXIT_PASSWORD() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_PASSWORD,
            data: {}
        });
    },
    TOGGLE_PASSWORD() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_PASSWORD,
            data: {}
        });
    },
    TOGGLE_FILTER(filterOverview) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.TOGGLE_FILTER,
            filterOverview
        });
    },
    NORESULTS_TRUE() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.NORESULTS_TRUE,
            data: {}
        });
    },

    NORESULTS_FALSE() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.NORESULTS_FALSE,
            data: {}
        });
    },

    PERFORM_SEARCH(searchTerm) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.PERFORM_SEARCH,
            searchTerm
        });
    },

    SET_SINGLE_FILTER(filterName){
      AppDispatcher.dispatch({
        actionType: ActionTypes.SET_SINGLE_FILTER,
        filterName
      });
    },

    BACK_TO_OVERVIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.BACK_TO_OVERVIEW,
        });
    },

    INIT_DETAIL_VIEW(project) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.INIT_DETAIL_VIEW,
            project
        });
        // ajax call machen
        // wenn ajax succesful trigger neue action
        // wenn fail trigger fail action
    },

    SHOW_DETAIL_VIEW(project) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.SHOW_DETAIL_VIEW,
            project
        });
        if (typeof _paq !== "undefined") {
            _paq.push(['setDocumentTitle', project.title]);
            _paq.push(['setCustomUrl', window.location.toString()]);
            _paq.push(['trackPageView']);
        }
    },
    EXIT_DETAIL_VIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_DETAIL_VIEW,
            data: {}
        });
    },
     SHOW_MATRIX_DETAIL_VIEW(project) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.SHOW_MATRIX_DETAIL_VIEW,
            project
        });
        if (typeof _paq !== "undefined") {
            _paq.push(['setDocumentTitle', project.title]);
            _paq.push(['setCustomUrl', window.location.toString()]);
            _paq.push(['trackPageView']);
        }
    },
    EXIT_MATRIX_DETAIL_VIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_MATRIX_DETAIL_VIEW,
            data: {}
        });
    },

    EXIT_SEARCH_VIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_SEARCH_VIEW,
            data: {}
        });
    },

    EXIT_FEEDBACK_VIEW() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.EXIT_FEEDBACK_VIEW,
            data: {}
        });
    },
    SWITCH_SUB_FILTER(filterTitle, subFilter) {
        AppDispatcher.dispatch({
            actionType: ActionTypes.SWITCH_SUB_FILTER,
            filterTitle,
            subFilter
        });
    },

    SWITCH_LOCK() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.SWITCH_LOCK,
            data: {}
        });
    },
    RESIZE() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.RESIZE,
            data: {}
        });
    },

    CLEAR_FILTERS() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.CLEAR_FILTERS,
            data: {}
        });
    },
    COPY_LINK() {
        AppDispatcher.dispatch({
            actionType: ActionTypes.COPY_LINK,
            data: {}
        });
    },

    CHECK_EMAIL() {
        AppDispatcher.dispatch({
          actionType: ActionTypes.CHECK_EMAIL,
          data: {}
        });
    },

    trigger(action, ...args) {
        if (typeof _paq !== "undefined" && action != window.lastPiwikAction && !window.temporarilyDisableTracking) {
            if(action == "NORESULTS_FALSE") {
                _paq.push(['trackEvent', "Projects filtering", "Projects found"]);
            }
            else if(action == "NORESULTS_TRUE") {
                _paq.push(['trackEvent', "Projects filtering", "Nothing found"]);
            }
            else if(action == "PERFORM_SEARCH") {
                _paq.push(['trackSiteSearch', args[0], false, false]);
            }
            else if(action == "INIT_DETAILVIEW") {
                //do noting
            }
            else {
                _paq.push(['trackEvent', action, JSON.stringify(args).substring(0,100)]);
            }
        }
        window.lastPiwikAction = action;
        setTimeout(() => this[action].apply(this, args), 0);
    }
};

export default Actions;
