let fullHDWidth = 1920;
let currentWidth = window.innerWidth;
let scale = currentWidth / fullHDWidth;

export const IS_MOBILE = function() {
    let isMobile = ((window.innerWidth < 1024) && (window.innerHeight < 768)) || ((window.innerWidth < 768) && (window.innerHeight < 1024));
    return isMobile;
}

// export const IS_TABLET = function(){
//   let isMobile = ((window.innerWidth < 1280) && (window.innerHeight < 800))
//    || ((window.innerWidth < 800) && (window.innerHeight < 1280));
//   return isMobile;
// }

export const PARTICLE_SIZE = function() {
    let fullHDWidth = 1920;
    let currentWidth = window.innerWidth;
    let scale = currentWidth / fullHDWidth;
    //  for mobile
    if (IS_MOBILE()) {
        return 175 * (scale >= 1 ? scale : 1);
    } else {
        return 250 * (scale >= 1 ? scale : 1);
    }
};

export const SUBFILTER_MINWIDTH = 330 * scale;
export const SCALE_MIN = 0.7;
export const SCALE_MAX = 0.97;

export const SCROLL_PADDING = function() {
    // for Mobile
    if (IS_MOBILE()) {
        return PARTICLE_SIZE() - 25;
    } else {
        return PARTICLE_SIZE() / 2;
    }
};

export const IDLE_SCROLL_DURATION = 20 // larger value: slower scroll
export const IDLETIME_MULTIP = 9; // 9 = 90sec
export const SCREENSAVER_IDLETIME = 30; //30*10/60=5min

export const ActionTypes = {
    SET_SINGLE_FILTER: 'SET_SINGLE_FILTER',
    EXIT_MATRIX_DETAIL_VIEW: 'EXIT_MATRIX_DETAIL_VIEW',
    SHOW_MATRIX_DETAIL_VIEW: 'SHOW_MATRIX_DETAIL_VIEW',
    EXIT_MATRIX_VIEW: 'EXIT_MATRIX_VIEW',
    TOGGLE_MATRIX: 'TOGGLE_MATRIX',
    SHOW_SCREENSAVER: 'SHOW_SCREENSAVER',
    TOGGLE_SEARCH: 'TOGGLE_SEARCH',
    TOGGLE_PASSWORD: 'TOGGLE_PASSWORD',
    EXIT_PASSWORD: 'EXIT_PASSWORD',
    TOGGLE_BUBBLE: 'TOGGLE_BUBBLE',
    TOGGLE_FILTER: 'TOGGLE_FILTER',
    PERFORM_SEARCH: 'PERFORM_SEARCH',
    INIT_DETAIL_VIEW: 'INIT_DETAIL_VIEW',
    SHOW_DETAIL_VIEW: 'SHOW_DETAIL_VIEW',
    EXIT_DETAIL_VIEW: 'EXIT_DETAIL_VIEW',
    EXIT_SEARCH_VIEW: 'EXIT_SEARCH_VIEW',
    SWITCH_SUB_FILTER: 'SWITCH_SUB_FILTER',
    CLEAR_FILTERS: 'CLEAR_FILTERS',
    COPY_LINK: 'COPY_LINK',
    CHECK_EMAIL: 'CHECK_EMAIL',
    SWITCH_LOCK: 'SWITCH_LOCK',
    RESIZE: 'RESIZE',
    NORESULTS_TRUE: 'NORESULTS_TRUE',
    NORESULTS_FALSE: 'NORESULTS_FALSE',
    TOGGLE_FEEDBACK: 'TOGGLE_FEEDBACK',
    EXIT_FEEDBACK_VIEW: 'EXIT_FEEDBACK_VIEW',
    BACK_TO_OVERVIEW: 'BACK_TO_OVERVIEW',
    ANIMATE_SCREENSAVER: 'ANIMATE_SCREENSAVER',
    RESET_TIMER: 'RESET_TIMER'
};

export const AnimationTimes = {
    SHOW_DETAIL_VIEW: 300,
    SHOW_MATRIX_DETAIL_VIEW: 100
};
