import "!style!raw!sass!./particlesscroller.scss"
require('core-js');
import React from "react";

import IScroll from '../../vendor/iscroll'

import Particle from '../particle/Particle';

import { PARTICLE_SIZE,ActionTypes } from '../../constants/constants';

import Actions from "../../actions/Actions";
import AppStore from '../../stores/AppStore';

import PropTypes from 'prop-types';

export default class ParticleScroller extends React.Component {

    constructor(props) {
        super(props);

        this.oldScrollLeft = 0;
        this.oldScrollTop = 0;
        this.width = window.innerWidth / 2;
        this.height = window.innerHeight / 2;
        this.oldWidth = this.props.size.domWidth;
        this.oldHeight = this.props.size.domHeight;

        this.state = {
            centerY: this.height,
            centerX: this.width,
            size: this.props.size.size,
        };
    }

    componentDidMount() {
        var that = this;
        this._iScroll = new IScroll('#scroller', {
            scrollX: false,
            scrollY: true,
            freeScroll: true,
            keyBindings: true,
            mouseWheel: true,
            probeType: 3,
            click: true,
            mouseWheelSpeed: 5,
            // important: override iScrolls faulty input method detection
            disableMouse: false,
            disablePointer: false,
            disableTouch: false
        });
        AppStore.setIScroll(this._iScroll);

        document.body.onkeydown = function() {
            that.handleScroll.bind(that)(that._iScroll.x, that._iScroll.y);
        };

        this._iScroll.on('scroll', function() {
            that.handleScroll.bind(that)(this.x, this.y);
        });

        // trigger update on first mount
        // wait 1 second before triggering the update, shall fix the sporadic problems with initial scroll position
        window.setTimeout(function(){
            Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
        }, 1000);
    }

    componentDidUpdate() {
        if (this.oldWidth !== this.props.size.domWidth || this.oldHeight !== this.props.size.domHeight) {
            this.oldWidth = this.props.size.domWidth;
            this.oldHeight = this.props.size.domHeight;


            setTimeout(() => {
                this._iScroll.scrollBy(0, 0);
                this._iScroll.refresh();
            }, 0);
        }

        if (this.props.overview && (this.oldScrollLeft !== this.props.size.scrollLeft || this.oldScrollTop !== this.props.size.scrollTop)) {
            this.oldScrollLeft = this.props.size.scrollLeft;
            this.oldScrollTop = this.props.size.scrollTop;
            this._iScroll.scrollTo(this.oldScrollLeft, this.oldScrollTop, 100, IScroll.utils.ease.linear);
        }
    }

    render() {
        let styles = {
            width: `${this.props.size.domWidth}px`,
            height: `${this.props.size.domHeight}px`,
        };

        let backgroundStyles = {};


        if (window.portfolio_backgroundImage && window.portfolio_backgroundImage !== 'false'){
          backgroundStyles = {
            backgroundImage: `url(${window.portfolio_backgroundImage})`,
            opacity:0.95
          };
        }

        return (
          <div className="particles__background" style={backgroundStyles}>
              <div className={'particles '+ this.props.size.animation} id='scroller'>
                  <div className='particles__inner' style={styles}>
                      {
                          this.props.projects.map((oProject, iIndex) => {
                              return (
                                  <Particle
                                      project={oProject}
                                      index={iIndex}
                                      key={iIndex}
                                      focus={this.state}
                                      isIE={this.props.isIE}
                                      iScroller={this._iScroll} />
                              );
                          })
                      }
                  </div>
              </div>
          </div>
        );
    }

    handleScroll(x, y) {
        const newX = x;
        const newY = y;
        this.width = window.innerWidth / 2;
        this.height = window.innerHeight / 2;
        requestAnimationFrame(() => {
            this.setState({
                centerX: this.width - newX,
                centerY: this.height - newY
            });
        });
    }
}


ParticleScroller.propTypes = {
    projects: PropTypes.array.isRequired,
    size: PropTypes.object.isRequired
};
