import AppDispatcher from '../dispatcher/AppDispatcher';
import { EventEmitter } from 'events';

import Actions from '../actions/Actions';
import AppRouter from '../router/AppRouter';

import {
    ActionTypes,
    SCALE_MIN,
    SCALE_MAX,
    SCROLL_PADDING,
    PARTICLE_SIZE,
    IDLETIME_MULTIP,
    IDLE_SCROLL_DURATION,
    SCREENSAVER_IDLETIME
} from '../constants/constants';

import ParticleScroller from '../components/particlesScroller/ParticleScroller';
import AppStore from '../stores/AppStore';


// IdleAnimation
// 1. check if this instance should have an idle animation
// 2. set timeout for user input
// 3. control animation
// 4. reset animation on user activity


class IdleAnimation extends EventEmitter {
    constructor(props) {
        super(props);
        this.resetTimer = this.resetTimer.bind(this);
        this.isActive = false;
        var that = this;
        that.idleTime = 0;
        this.oldScreenX = -1;
        this.oldScreenY = -1;

        if (window.idleScrollEnabled && localStorage.getItem('locked') == 'true') {
            //Increment the idle time counter every minute.
            var idleInterval = setInterval(function timerIncrement() {
                that.idleTime = that.idleTime + 1;
                if (that.idleTime >= IDLETIME_MULTIP && !that.isActive && !AppStore.getIsVideoPlaying()  && AppStore.getLockedFilters().length === 0 && !AppStore.getScreenSaverMode()) {
                    if (localStorage.getItem('locked') === 'true') {
                        window.temporarilyDisableTracking = true; //Prevents Piwik from beeing flooded with automatic events
                        Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
                        Actions.trigger(ActionTypes.EXIT_SEARCH_VIEW);
                        Actions.trigger(ActionTypes.EXIT_FEEDBACK_VIEW);
                        Actions.trigger(ActionTypes.EXIT_MATRIX_VIEW);
                        // Actions.trigger(ActionTypes.TOGGLE_FILTER, true); //triggers reordering of the bubbles
                        Actions.trigger(ActionTypes.CLEAR_FILTERS);
                        window.temporarilyDisableTracking = false;
                    }
                    that.startAnimation();
                    that.idleTime = 0;
                } else if (AppStore.getScreenSaverMode() && !AppStore.getScreenSaverActive() && that.idleTime >= IDLETIME_MULTIP && !AppStore.getIsVideoPlaying()) {
                    that.resetTimer();
                    Actions.trigger(ActionTypes.SHOW_SCREENSAVER);
                } else if (AppStore.getScreenSaverMode() && AppStore.getScreenSaverActive() && that.idleTime >= SCREENSAVER_IDLETIME){
                    that.resetTimer();
                    Actions.trigger(ActionTypes.ANIMATE_SCREENSAVER);
                } else {
                    if (that.idleTime >= 90) //20min
                    {
                        if (AppRouter.getBacklink()) {
                            location.href = AppRouter.getBacklink();
                        } else {
                            location.reload();
                        }
                    }
                }
            }, 10000); // 10sec

            //Zero the idle timer on mouse movement.

            window.addEventListener('mousemove',
                function(oEvent) {
                    if (this.oldScreenX !== oEvent.screenX || this.oldScreenY !== oEvent.screenY) {
                        this.oldScreenX = oEvent.screenX;
                        this.oldScreenY = oEvent.screenY;
                        that.resetTimer();
                    }
                });
            window.addEventListener('keypress', this.resetTimer);
            window.addEventListener('tap', this.resetTimer);
            window.addEventListener('wheel', this.resetTimer);
            window.addEventListener("touchmove", this.resetTimer);
            window.addEventListener("touchstart", this.resetTimer);
            window.addEventListener("touchend", this.resetTimer);


            AppDispatcher.register((action) => {
              switch (action.actionType) {
                case ActionTypes.RESET_TIMER:
                  this.resetTimer();
                  break;
              }
            });
        }
    }

    resetTimer() {
        this.idleTime = 0;
        if (this.isActive) {
            var scroller = AppStore.getIScroll();
            if (scroller){
              scroller.scrollTo(scroller.x, scroller.y, 1);
              this.isActive = false;
              clearTimeout(this.animationTimeout);
            }
        }
    }
    startAnimation() {
        if (window.idleScrollEnabled && localStorage.getItem('locked') == 'true') {
            this.isActive = true;
            var scroller = AppStore.getIScroll();
            scroller.scrollTo(scroller.x, scroller.y, 1);
            this.scroll(true);
        }
    }
    scroll(bDown) {
        var that = this;
        var scroller = AppStore.getIScroll();
        var target = scroller.maxScrollY + SCROLL_PADDING();
        if (!bDown) {
            target = 0 - SCROLL_PADDING();
        }
        var diff = target - scroller.y;
        var time = Math.abs(diff * IDLE_SCROLL_DURATION);

        scroller.scrollTo(scroller.x, target, time, {
            style: '',

            fn: function(k) {
                // let b = 1.1
                // return -k * b / (1-b-k); // sigmoid
                // return k * (2 - k);  // quadratic
                return k; // linear
            }

        });
        this.animationTimeout = setTimeout(function() {
            //Forces reload in case iScroller got stuck
            /*if(Math.abs(scroller.y - target) > 500) {
                location.reload();
            }*/
            that.scroll(!bDown)
        }, time + 50)
    }



}

export default new IdleAnimation();
