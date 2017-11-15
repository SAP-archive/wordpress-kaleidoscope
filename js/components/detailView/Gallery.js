require("!style!raw!sass!./gallery.scss");
require("!style!raw!sass!./gallery-theme.scss");
require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.js');

PDFJS.disableWorker = false;

var Isvg = require('react-inlinesvg');

import React from "react";
import Slider from 'react-slick';

import AppStore from '../../stores/AppStore';
import VideoPlayer from './VideoPlayer.js';

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            fullscreenMode: false
        };
        window.galleryMouseMove = false;
        this.renderPDFPreview = this.renderPDFPreview.bind(this);
        this.handleFullScreenClick = this.handleFullScreenClick.bind(this);
    }

    componentDidUpdate() {
        // this.refs.slider.currentSlide = 0;
    }

    static preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        e.returnValue = false;
    }

    static nodeUsesClass(node, classList) {
        classList.forEach((className) => {
            if(node.classList.contains(className)) {
                return true;
            }
        });
        return false;
    }

    handleFullScreenClick(oEvent, forceProcessing = false) {
       
        const controlElements = ['INPUT', "LI", "BUTTON", "VIDEO"];
        const classList = ['playpause', 'video_controls_bar', 'slick-dots'];
        if(forceProcessing || !window.galleryMouseMove && !controlElements.includes(oEvent.target.nodeName) && !Gallery.nodeUsesClass(oEvent.target, classList)) {
            const targetRow =  document.getElementById('gallery-container').parentNode.parentNode;
            const sizingParentWrapper = targetRow.parentNode.parentNode;
            if (this.state.fullscreenMode) {
                document.getElementById('detail-view-exit-button-wrapper').style.display = 'block';
                document.getElementById('fullscreen-view-exit-button-wrapper').style.display = 'none';
                sizingParentWrapper.classList.remove("wrapper-fix-row-fullscreen");
                targetRow.classList.remove("row-fullscreen");
                targetRow.removeEventListener("click", this.handleFullScreenClick);
                window.onwheel = null; // modern standard
                window.onmousewheel = document.onmousewheel = null; // older browsers, IE
                window.ontouchmove  = null; // mobile
            } else {
                document.getElementById('detail-view-exit-button-wrapper').style.display = 'none';
                document.getElementById('fullscreen-view-exit-button-wrapper').style.display = 'block';
                targetRow.classList.add("row-fullscreen");
                sizingParentWrapper.classList.add("wrapper-fix-row-fullscreen");
                targetRow.addEventListener("click", this.handleFullScreenClick);
                window.onwheel = Gallery.preventDefault; // modern standard
                window.onmousewheel = document.onmousewheel = Gallery.preventDefault; // older browsers, IE
                window.ontouchmove  = Gallery.preventDefault; // mobile
            }
            this.setState({
                fullscreenMode: !this.state.fullscreenMode,
            });
          oEvent.stopPropagation();
          oEvent.preventDefault();
        } 
        window.galleryMouseMove = false;
    }

    renderPDFPreview(url, key){
      // Asynchronous download PDF
      PDFJS.getDocument(url)
        .then(function(pdf) {
          pdf.getPage(1).then(function(page) {

            // Set scale (zoom) level
            let scale = 1;

            // Get canvas#the-canvas
            let canvas = document.getElementById('pdf_canvas_'+key);
            let context = canvas.getContext('2d');
            let height = page.getViewport(1.0).height;
            let width = page.getViewport(1.0).width;

            let maxHeight = 500;
            if (window.innerWidth > 1920){
              maxHeight = window.innerWidth * 0.26;
            }

            canvas.height = 100;
            canvas.width = 100;

            let viewport = null;
            if (height > width){
              viewport = page.getViewport(maxHeight / height);
              canvas.width = viewport.width;
              canvas.height = viewport.height;
            } else {
              viewport = page.getViewport(maxHeight / height);
              canvas.width = viewport.width;
              canvas.height = viewport.height;
            }

            // Prepare object needed by render method
            let renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            // Render PDF page
            page.render(renderContext);
          });
        });
    }

    componentDidMount() {

        var aVideoList = document.getElementsByTagName("video");
        for (var i = 0; i < aVideoList.length; i++) {
            aVideoList[i].addEventListener('play', function() {
                AppStore.setIsVideoPlaying(true);
                this.parentNode.children[0].style.display = 'none';
            });
            aVideoList[i].addEventListener('pause', function() {
                AppStore.setIsVideoPlaying(false);
                this.parentNode.children[0].style.display = 'block';
            });
        }

        // render pdf previews
        var that = this;
        this.props.gallery.map(function(media, index) {
          if (media.type === 'pdf' || media.type === 'application'){
            that.renderPDFPreview(media.url, index);
          }
        });
    }

    render() {
        let that = this;
        let arrow = this.props.arrows || true;
        let settings = {
            dots: this.props.dotsVisible,
            adaptiveHeight: false,
            arrows: arrow,
            infinite: false,
            draggable: true,
            initialSlide: this.state.slideIndex,
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        const category = AppStore.getPortfolioCategory(this.props.project.portfolioAreaClass);
        return (
            <div className="gallery-container" id="gallery-container"
                 onMouseDown={() => {window.galleryMouseMove = false;}}
                 onMouseMove={() => {window.galleryMouseMove = true;}}
                 onClick={this.handleFullScreenClick}>
                <div onClick={this.handleFullScreenClick} tabIndex="1"
                     style={{display: 'none'}} id="fullscreen-view-exit-button-wrapper">
                    <div className={`detailview__exitbutton ${category}`} onClick={this.onExit}>
                        <Isvg src={window.icnThemePath + 'img/exit.svg'}/>
                        <span className="detailview__exitbutton__overlay" onClick={this.handleFullScreenClick} />
                    </div>
                </div>
                <Slider {...settings} ref="slider">
                {
                    this.props.gallery.map(function(media, index) {
                        if (media.type === 'image') {
                          if (media.filename && media.filename.split("__DEMO").length > 1) {
                            return (
                                <div key={index}>
                                    <div className="slick-icnimagewidth">
                                        <div className="wrapper">
                                            <a target="_blank" href={media.description}>
                                                <div className="demoOverlay">Demo</div>
                                            </a>
                                            <img className="slick-icnheightimage" src={media.url}/>
                                        </div>
                                    </div>
                                </div>
                            );
                          } else if (media.filename && media.filename.split("__VIMEO").length > 1) {
                            return (
                              <div key={index}>
                                <div className="slick-icnimagewidth">
                                  <div className="wrapper">
                                    <div onClick={that.handleVimeoClick} className="playpause">
                                      <a target="_blank" className="vimeoPlayPause" href={media.description}></a></div>
                                      <a target="_blank" href={media.description}><img className="slick-icnheightimage" src={media.url} /></a>
                                    </div>
                                </div>
                              </div>
                              );
                            } else {
                              return (
                                <div key={index}>
                                  <div className="slick-icnimagewidth">
                                    <img className="slick-icnheightimage" src={media.url} onClick={that.handleFullScreenClick} />
                                  </div>
                                </div>
                                );
                              }

                        } else if (media.type === 'video') {
                            var standalone = window.navigator.standalone,
                                userAgent = window.navigator.userAgent.toLowerCase(),
                                safari = /safari/.test( userAgent ),
                                ios = /iphone|ipod|ipad/.test( userAgent );
                            return (
                                <div key={index}>
                                    <div className="wrapper">
                                        <VideoPlayer
                                            media={media}
                                            activateFullscreen={that.handleFullScreenClick}
                                            isFullscreen={that.state.fullscreenMode}/>
                                    </div>
                                    <div className="slick-slide-caption">
                                        {media.caption}
                                    </div>
                                </div>
                            );
                        } else if (media.type === 'pdf' || media.type === 'application') {
                          let canvas_style = {
                            maxWidth: "100%",
                            maxHeight: "100%",
                            display: "inline",
                            cursor: "pointer"
                          };

                          let canvas_container_style = {
                            width:"100%",
                            height:"100%",
                            textAlign:"center",
                            position: "relative"
                          };

                          let canvas_id = "pdf_canvas_"+index;
                          let canvas_object = <canvas id={canvas_id} height={"400px"} width={"700px"} style={canvas_style}></canvas>;
                          let isSmallDisplay = window.innerWidth < 500;
                          if (isSmallDisplay){
                            canvas_object =  <canvas id={canvas_id} height={"400px"} width={"700px"} style={canvas_style}></canvas>;
                          }

                          return (
                            <div key={index}>
                              <div style={canvas_container_style}>
                                {canvas_object}
                                  {(() => {
                                      if (window.portfolio_showPDFOverlay) {
                                          return (<div className="canvasOverlay">PDF</div>);
                                      }
                                  })()}
                              </div>
                              <div className="slick-slide-caption">
                                  {media.caption}
                              </div>
                            </div>
                          );
                        }
                    })
                }
            </Slider>
        </div>);
    }
}
