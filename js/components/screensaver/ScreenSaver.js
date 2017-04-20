import "!style!raw!sass!./screensaver.scss"
import React from "react";
import AppStore from '../../stores/AppStore';
import Actions from '../../actions/Actions';
import { ActionTypes } from '../../constants/constants';

var Isvg = require('react-inlinesvg');


export default class ScreenSaver extends React.Component {

    constructor(props) {
        super(props);

        this.images = [];
        if (window.portfolio_screensaverImages){
          this.images = window.portfolio_screensaverImages;
        }

        this.state = {
            currently_active : true,
            imageNumber: 0
        };

        this.browseForward = true;

        this.onNextClick = this.onNextClick.bind(this);
        this.onPrevClick = this.onPrevClick.bind(this);
        this.onExit = this.onExit.bind(this);
        this.onBackgroundClick = this.onBackgroundClick.bind(this);
        this.hasNextImage = this.hasNextImage.bind(this);
        this.hasPrevImage = this.hasPrevImage.bind(this);
        this.goToNextImage = this.goToNextImage.bind(this);
        this.goToPrevImage = this.goToPrevImage.bind(this);
    }

    componentDidMount() {
        AppStore.on("change", this.onChange.bind(this));
    }

    componentWillUnmount() {
        AppStore.removeListener("change", this.onChange);
    }

    componentDidUpdate(){
      if (AppStore.getScreenSaverActive() && AppStore.isAnimateScreensaver() && this.images.length > 0){
        AppStore.setAnimateScreenSaver(false);

        // update browse direction
        if (this.browseForward && !this.hasNextImage()){
            this.browseForward = false;
        }
        if (!this.browseForward && !this.hasPrevImage()){
          this.browseForward = true;
        }

        // browse images
        if (this.browseForward){
          this.goToNextImage()
        } else {
          this.goToPrevImage();
        }
      }
    }

    hasNextImage(){
      return (this.state.imageNumber + 1 < this.images.length);
    }

    hasPrevImage(){
      return (this.state.imageNumber > 0);
    }

    goToNextImage(){
      let nextNum = (this.state.imageNumber + 1) >= this.images.length ? this.state.imageNumber  : (this.state.imageNumber + 1) ;
      this.setState({imageNumber: nextNum});
    }

    goToPrevImage(){
      let nextNum = (this.state.imageNumber - 1) <= 0 ? 0 : (this.state.imageNumber - 1) ;
      this.setState({imageNumber: nextNum});
    }

    render() {

        if (this.images.length <= 0){
          return null;
        }

        let styles = {
            background: 'url(' + this.images[this.state.imageNumber] + ') no-repeat center fixed'
        };
        let classNames = "screenSaver_Show_Animation";
        if(!this.state.currently_active) {
            classNames = "screenSaver_Hide_Animation";
        }

        let nextClasses = "screensaver__forward screensaver__button";
        if (!this.hasNextImage()){
          nextClasses += " screensaver__button_inactive"
        }

        let prevClasses = "screensaver__back screensaver__button";
        if (!this.hasPrevImage()){
          prevClasses += " screensaver__button_inactive"
        }


        return (
            <div className={`${classNames} screenSaverBackground`} style={{background: "white"}} onClick={this.onBackgroundClick}>
            <div className={`${classNames} screenSaver`} style={styles} onClick={this.onBackgroundClick}>

              <img src={window.icnThemePath + 'img/back_fill.svg'} className={prevClasses} onClick={this.onPrevClick}
                  ref={(prev) => this.prevButton = prev} />
              <img src={window.icnThemePath + 'img/back_fill.svg'} className={nextClasses} style={{transform: "rotate(180deg)"}} onClick={this.onNextClick}
                  ref={(next) => this.nextButton = next} />
              <img src={window.icnThemePath + 'img/exit.svg'} className="screensaver__button screensaver__exit" onClick={this.onExit}/>

            </div>
            </div>
        );
    }

    onBackgroundClick(e){
      AppStore.setAnimateScreenSaver(false);
      Actions.trigger(ActionTypes.RESET_TIMER);
    }

    onNextClick(e){
      let nextNum = (this.state.imageNumber + 1) >= this.images.length ? this.state.imageNumber  : (this.state.imageNumber + 1) ;
      this.setState({imageNumber: nextNum});
      AppStore.setAnimateScreenSaver(false);
      Actions.trigger(ActionTypes.RESET_TIMER);
    }

    onPrevClick(e){
      let nextNum = (this.state.imageNumber - 1) <= 0 ? 0 : (this.state.imageNumber - 1) ;
      this.setState({imageNumber: nextNum});
      AppStore.setAnimateScreenSaver(false);
      Actions.trigger(ActionTypes.RESET_TIMER);
    }


    onExit(e) {
        this.setState({currently_active : false, imageNumber: 0});
        AppStore.setScreenSaverActive(false);
        AppStore.setAnimateScreenSaver(false);
        Actions.trigger(ActionTypes.RESET_TIMER);
    }

    onChange() {
        this.setState({currently_active : AppStore.getScreenSaverActive()});
        this.forceUpdate();
    }
}
