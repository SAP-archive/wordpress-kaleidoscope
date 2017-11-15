require("!style!raw!sass!./particle.scss");
require("!style!raw!sass!./particle-animations.scss");
require('core-js');

import React from 'react';
import AppStore from '../../stores/AppStore';
import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

import {
    SCALE_MIN,
    SCALE_MAX,
    SCROLL_PADDING,
    PARTICLE_SIZE,
    IDLE_SCROLL_DURATION
} from '../../constants/constants';

export default class Particle extends React.Component {

    constructor(props) {
        super(props);

        this.scale = 0;
        this.newScale = 0;
        this.delay = Math.random() * 0.1;
        this.animation = '';
        this.top = this.props.project.initialTop;
        this.left = this.props.project.initialLeft;

        if (this.props.project.bubble_background) {
            this.backgroundImageSrc = this.props.project.bubble_background.url;
        } else {
            this.backgroundImageSrc = this.props.project.imageUrl;
        }
        this.backgroundUrl = this.backgroundImageSrc ? `url(${this.backgroundImageSrc})` : "";
        this.onClick = this.onClick.bind(this);
        this.isIE = this.props.isIE;
        this.is_updated = false;

        if (this.props.project.date) {
            this.is_updated = (new Date() - Date.parse(this.props.project.date.replace(" ", "T"))) / 1000 / 60 / 60 / 24 < window.updatedTimeInDays;
        }
        this.onFocus = this.onFocus.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

    }

    shouldComponentUpdate(nextProps, nextState) {
        let distX = nextProps.focus.centerX - nextProps.project.nextLeft,
            distY = nextProps.project.nextTop - nextProps.focus.centerY;
        let dist = distY * distY;
        this.newScale = 1 - (dist * 0.5 / (nextProps.focus.size));
        //this.newScale += 0.2;
        this.newScale = this._clamp(this.newScale, SCALE_MIN, SCALE_MAX);
        let scaleChanged = (this.scale !== this.newScale);
        let positionChanged = this.top !== nextProps.project.nextTop || this.left !== nextProps.project.nextLeft;
        let animationChanged = this.animation !== nextProps.project.animation;
        let visibilityChanged = false;
        if (nextProps.project.cssVisibility) {
            visibilityChanged = this.cssVisibility !== nextProps.project.cssVisibility;
        } else {
            visibilityChanged = true;
            nextProps.project.cssVisibility = this.cssVisibility;
        }
        this.animation = nextProps.project.animation ? nextProps.project.animation : "";
        nextProps.project.animation = '';

        // deactivate scaling while scrolling
        // var iScroller = AppStore.getIScroll();
        // if (iScroller.x !== this.oldX || iScroller.y !== this.oldY) {
        //     if (scaleChanged && !positionChanged && !animationChanged && !visibilityChanged) {
        //         console.log("foo")
        //     }
        //     scaleChanged = false;

        // }
        // this.oldX = iScroller.x;
        // this.oldY = iScroller.y;
        return scaleChanged || positionChanged || animationChanged || visibilityChanged;
    }

    render() {
        this.scale = this.props.project.fixScale ? this.props.project.fixScale : this.newScale;
        this.top = this.props.project.nextTop ? this.props.project.nextTop : this.top;
        this.cssVisibility = this.props.project.cssVisibility ? this.props.project.cssVisibility : "visible";
        this.left = this.props.project.nextLeft ? this.props.project.nextLeft : this.left;

        let positionStyle = {
            visibility: `${this.cssVisibility}`,
            transform: `translate(${this.left}px,${this.top}px)`,
            // WebkitTransitionDelay: `${this.delay}s`,
            // transitionDelay: `${this.delay}s`,
            transition: "transform 1s"
        };

        let scaleStyle = {
            width: `${PARTICLE_SIZE()}px`,
            height: `${PARTICLE_SIZE()}px`,
            transform: `scale(${this.scale})`,
            transitionDelay: `${this.delay}s`,
            transition: "transform 1s"
        };

        let cat = '';
        if (this.props.project[window.portfolio_coloredByElement]) {
            cat = AppStore.getPortfolioCategory(this.props.project);
        } else if (this.props.project.overviewCat !== undefined) {
            cat = "category_" + this.props.project.overviewCat;
        }
        let background = ( <div className = 'particle__inner-container' >
            <div className = { `particle__inner-background particle__${cat}` }
            style = {
                { backgroundImage: this.backgroundUrl }
            }
            /> </div >
        );

        if (this.isIE) {
            background = ( < div className = { `particle_background_tint__category particle_background_tint__${cat}` } >
                < img className = "particle_background_image"
                src = { this.backgroundImageSrc }
                /> </div >
            );
        }

        let updateTagStyle = {
            display: this.is_updated ? "block" : "none",
        };

        return ( < a onFocus={this.onFocus} onKeyDown={this.onKeyDown} href = { '/' + this.props.project.slug }
            className = { 'particle ' + this.animation }
            style = { positionStyle }
            onClick = { this.onClick } >
            < div className = "particle__scale"
            style = { scaleStyle } >
            < div className = { `particle__inner particle__${cat}` } > { background } < div className = "particle__inner-table" >
            < div className = "particleUpdatedTag"
            style = { updateTagStyle } > Updated </div> < h4 className = "particle__inner-heading"
            dangerouslySetInnerHTML = {
                { __html: this.props.project.title }
            }
            /> </div > </div> </div > </a>
        );
    }
    onFocus(event) {
        const scroller =  this.props.iScroller;
        const rectangle = document.activeElement.getBoundingClientRect();
        const scrollByY = PARTICLE_SIZE()*this.scale;
        if(rectangle.bottom - (rectangle.height*this.scale) > PARTICLE_SIZE() && scroller.maxScrollY <= scroller.y - scrollByY) {
            scroller.scrollBy(0,-(scrollByY), 100);
        } else if (rectangle.top < 0) {
            scroller.scrollTo(scroller.x, 0, 500);
        }
    }

    onKeyDown(event) {
        //Enter or Space
        if(event.key === 'Enter' || event.keyCode == 32) {
            this.onClick(event);
        }
    }

    onClick(event) {
        event.preventDefault();
        Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, this.props.project);
    }

    _clamp(value, min, max) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}

Particle.propTypes = {};
Particle.defaultProps = {};
