import "!style!raw!sass!./overview.scss"
import React from "react";

import Slider from 'react-slick';

import OverviewParticle from './OverviewParticle';

import { PARTICLE_SIZE } from './OverviewParticle';
import Actions from "../../actions/Actions";
import AppStore from '../../stores/AppStore';

import SkyAnimation from './SkyAnimation';
import PropTypes from 'prop-types';
export default class Overview extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            currentIframe: ""
        };

        this.handleIframeClose = this.handleIframeClose.bind(this);
        this.timerIncrement = this.timerIncrement.bind(this);
        this.resetTimer = this.resetTimer.bind(this);

        var idleInterval = setInterval(this.timerIncrement, 60000);

        window.addEventListener('keypress', this.resetTimer);
        window.addEventListener('tap', this.resetTimer);
        window.addEventListener('wheel', this.resetTimer);
        window.addEventListener('touchmove', this.resetTimer);
        window.addEventListener('touchstart', this.resetTimer);
        window.addEventListener('touchend', this.resetTimer);
    }

    timerIncrement() {
        if (this.state.currentIframe != "") {
            this.idleTime = this.idleTime == undefined ? 0 : this.idleTime + 1;
            console.log(this.idleTime);
            if (this.idleTime >= window.overviewTimerMax) {
                this.resetTimer();
                this.handleIframeClose();         
            }
        }
    }

    resetTimer() {
        this.idleTime = 0;
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    handleIframeClose() {
        this.setState({
            currentIframe: ""
        });

        // var iframes = document.getElementsByTagName("iframe");
        // for (var i = 0; i < iframes.length; i++) {
        //     iframes[i].contentWindow.postMessage('Hello World', 'http://localhost');
        // }
    }

    render() {
        let overviewData = AppStore.getOverviewData();

        let sliderSettings = {
            dots: false,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
        };

        let overviewBottomClasses = this.state.currentIframe != "" ? "hidden" : "";

        return (

            <
            div className = 'overview__container' >

            {
                overviewData.map((oProject, iIndex) => {

                    let style = {
                        opacity: this.state.currentIframe == oProject.url ? 1 : 0,
                        visibility: this.state.currentIframe == oProject.url ? "visible" : "hidden"
                    }
                    let iFrameClass = this.state.currentIframe == oProject.url ? "iframevisible" : "iframehidden";


                    return ( <
                        div className = { `overview__iframe_container ${iFrameClass}` } style = { style } key = { iIndex } >
                        <
                        iframe src = { oProject.url } className = 'overview__iframe' / >
                        <
                        div className = "overview__iframe_close_button"
                        onClick = { this.handleIframeClose } >
                        HOME <
                        /div> <
                        /div>
                    );
                })
            }

            <
            div className = { `overview__bottom ${overviewBottomClasses}` } > < /div>

            <
            SkyAnimation animating = { this.state.currentIframe == "" }
            />

            <
            div className = 'overview__inner' > {
                overviewData.map((oProject, iIndex) => {
                    oProject.overviewCat = (iIndex % 6 < 10) ? ("0" + iIndex % 6) : iIndex % 6;
                    oProject.slug = oProject.url;

                    return ( <
                        OverviewParticle project = { oProject } index = { iIndex } key = { iIndex } focus = { this.state } isIE = { this.props.isIE } target = { oProject.url } overview = { this }
                        />
                    );
                })
            } <
            /div> <
            div className = 'overview__logo' >
            <h3>Explore what we do.</h3>
            </div> <
                /div>
        );
    }

}


Overview.propTypes = {
    size: PropTypes.object.isRequired
};