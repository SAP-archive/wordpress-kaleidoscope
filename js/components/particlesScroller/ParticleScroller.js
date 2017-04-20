import "!style!raw!sass!./particlesscroller.scss"
require('core-js');
import React from "react";

import IScroll from '../../vendor/iscroll'

import Particle from '../particle/Particle';

import { PARTICLE_SIZE } from '../../constants/constants';
import Actions from "../../actions/Actions";
import AppStore from '../../stores/AppStore';

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

        /*
        TRIED TO CATCH KEYDOWN EVENT TO SCALE BUBBLES/PROJECTS WHILE SCROLLING VIA KEYBOARD => NOT WORKING
        document.body.addEventListener('keydown', function() {
            that.handleScroll.bind(that)(this.x, this.y);
        });*/

        this._iScroll.on('scroll', function() {
            that.handleScroll.bind(that)(this.x, this.y);
        });

        // trigger update on first mount
        requestAnimationFrame(() => {
            this.setState({
                centerY: this.height,
                centerX: this.width,
                size: this.props.size.size,
            });
        });
        this.props.projects.alignProjectsToFilterBar(this._iScroll, AppStore.getFilterOverview());
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
    projects: React.PropTypes.array.isRequired,
    size: React.PropTypes.object.isRequired
};
