import React from "react";
import AppStore from '../../stores/AppStore';
require("!style!raw!sass!./VideoPlayer.scss");

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.volume = 0;
        this.currentTimeText = "00:00";
        this.durationTimeText = "00:00";
        this.playPause = this.playPause.bind(this);
        this.handleVideoClick = this.handleVideoClick.bind(this);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.mute = this.mute.bind(this);
        this.changeVolume = this.changeVolume.bind(this);
        this.changeVideoPosition = this.changeVideoPosition.bind(this);
        this.updateVideoTime = this.updateVideoTime.bind(this);
    }

    componentDidMount() {
        this.videoPlayer.addEventListener("timeupdate", this.updateVideoTime, false);
        this.videoPlayer.addEventListener("loadeddata", this.updateVideoTime, false);
        this.playPauseButton.style.background = "url('"+window.icnThemePath+"img/play.png') no-repeat center";
        this.muteButton.style.background = "url('"+window.icnThemePath+"img/volume-medium.png') no-repeat center";
        if(this.props.isFullscreen) {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-shrink.png') no-repeat center";
        } else {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-expand.png') no-repeat center";
        }
        this.playPauseButton.style.backgroundSize = "contain";
        this.muteButton.style.backgroundSize = "contain";
        this.fullscreenButton.style.backgroundSize = "contain";
    }

    componentDidUpdate() {
        this.updateVideoTime();
        if(this.props.isFullscreen) {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-shrink.png') no-repeat center";
        } else {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-expand.png') no-repeat center";
        }
        this.fullscreenButton.style.backgroundSize = "contain";
    }

    handleVideoClick(oEvent) {
        if(!window.galleryMouseMove) {
            let oVideoElement = oEvent.target.parentNode.children[1];
            let oOverlayElement = oEvent.target.parentNode.children[0];
            if (oVideoElement.paused) {
                this.playPause();
                oOverlayElement.style.display = 'none';
            } else {
                this.playPause();
                oOverlayElement.style.display = 'block';
            }
        }
    }

    changeVideoPosition() {
        this.videoPlayer.currentTime = this.videoPlayer.duration * (this.videoTimeSlider.value / 100);
    }

    changeVolume(event) {
        event.stopPropagation();
        this.volume = (event.target.value / 100);
        this.videoPlayer.volume = this.volume;
    }

    playPause() {
        if (this.videoPlayer.paused) {
            this.videoPlayer.play();
            AppStore.setIsVideoPlaying(true);
            this.playPauseButton.style.background = "url('"+window.icnThemePath+"img/pause.png') no-repeat center";
        } else {
            this.videoPlayer.pause();
            AppStore.setIsVideoPlaying(false);
            this.playPauseButton.style.background = "url('"+window.icnThemePath+"img/play.png') no-repeat center";
        }
        this.playPauseButton.style.backgroundSize = "contain";
    }

    mute() {
        if (this.videoPlayer.muted) {
            this.volumeSlider.value = this.volume * 100;
            this.videoPlayer.volume = this.volume;
            this.videoPlayer.muted = false;
            this.muteButton.style.background = "url('"+window.icnThemePath+"img/volume-medium.png') no-repeat center";
        } else {
            this.volume = this.volumeSlider.value / 100;
            this.volumeSlider.value = 0;
            this.videoPlayer.muted = true;
            this.muteButton.style.background = "url('"+window.icnThemePath+"img/volume-mute.png') no-repeat center";
        }
        this.muteButton.style.backgroundSize = "contain";
    }

    toggleFullScreen() {
        if(this.props.isFullscreen) {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-expand.png') no-repeat center";
        } else {
            this.fullscreenButton.style.background = "url('"+window.icnThemePath+"img/arrow-shrink.png') no-repeat center";
        }
        this.fullscreenButton.style.backgroundSize = "contain";
        this.props.activateFullscreen(new MouseEvent("WrappeEvent"), true);
    }

    updateVideoTime() {
        if(this.videoPlayer) {
            const videoTime = this.videoPlayer.currentTime;
            const videoDuration = this.videoPlayer.duration;
            if (!(videoTime.isNaN && videoDuration.isNaN)) {
                this.videoTimeSlider.value = videoTime * (100 / this.videoPlayer.duration);
                let currentMins = Math.floor(videoTime / 60);
                let currentSeconds = Math.floor(videoTime - currentMins * 60);
                let durationMins = Math.floor(videoDuration / 60);
                let durationSeconds = Math.floor(videoDuration - durationMins * 60);
                if (currentSeconds < 10) {
                    currentSeconds = "0" + currentSeconds;
                }
                if (durationSeconds < 10) {
                    durationSeconds = "0" + durationSeconds;
                }
                if (durationMins < 10) {
                    durationMins = "0" + durationMins;
                }
                if (currentMins < 10) {
                    currentMins = "0" + currentMins;
                }
                this.currentTimeTextWrapper.innerHTML = currentMins + ":" + currentSeconds;
                this.durationTimeTextWrapper.innerHTML = durationMins + ":" + durationSeconds;
                this.currentTimeText = currentMins + ":" + currentSeconds;
                this.durationTimeText = durationMins + ":" + durationSeconds;
            }
        }
    }
    preventEventPropagation(e) {
        e.stopPropagation();
    }

    componentWillUnmount() {
        //Important, do not remove - Solves rendering bug of slick-slider
        this.playPauseButton.style.background = 'none';
        this.muteButton.style.background = 'none';
        this.fullscreenButton.style.background = 'none';
    }

    render() {
        return (
            <div className="video-player-wrapper" onClick={this.preventEventPropagation}>
                <div
                    onClick={this.handleVideoClick}
                    className="playpause">
                    &nbsp;
                </div>
                <video ref={(input) => { this.videoPlayer = input; }}
                       onClick={this.handleVideoClick}
                       className="slick-icnheightvideo"
                       src={this.props.media.url} />
                <div className="video_controls_bar" onClick={this.preventEventPropagation}>
                    <button className="play-pause-button video_control_button pause"
                            ref={(input) => { this.playPauseButton = input; }}
                            onClick={this.playPause} />
                    <span
                        className="current-time-text"
                        ref={(input) => { this.currentTimeTextWrapper = input; }}>
                        {this.currentTimeText}
                    </span>
                    <input className="video-time-slider"
                           ref={(input) => { this.videoTimeSlider = input; }}
                           type="range"
                           min="0" max="100"
                           onChange={this.changeVideoPosition}
                           onMouseDown={this.preventEventPropagation}
                           onMouseUp={this.preventEventPropagation}
                           onTouchStart={this.preventEventPropagation}
                           onTouchEnd={this.preventEventPropagation}
                           onTouchMove={this.preventEventPropagation}
                           />
                    <span
                        className="duration-time-text"
                        ref={(input) => { this.durationTimeTextWrapper = input; }}>
                        {this.durationTimeText}
                    </span>
                    <button
                        className="muteButton video_control_button unmuted"
                        ref={(input) => { this.muteButton = input; }}
                        onClick={this.mute}/>
                    <input className="volume-slider"
                           ref={(input) => { this.volumeSlider = input; }}
                           type="range"
                           min="0" max="100"
                           onChange={this.changeVolume}
                           onMouseDown={this.preventEventPropagation}
                           onMouseUp={this.preventEventPropagation}
                           onTouchStart={this.preventEventPropagation}
                           onTouchEnd={this.preventEventPropagation}
                           onTouchMove={this.preventEventPropagation}
                    />
                    <button
                        className="fullscreenButton video_control_button"
                        ref={(input) => { this.fullscreenButton = input; }}
                        onClick={this.toggleFullScreen} />
                </div>
            </div>
        );
    }
}