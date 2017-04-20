require("!style!raw!sass!./gallery.scss");
require("!style!raw!sass!./gallery-theme.scss");
require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.js');

PDFJS.disableWorker = false;


import React from "react";
import Slider from 'react-slick';
import DetailLightBox from "./DetailLightBox.js";


import AppStore from '../../stores/AppStore';

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        }
        this.renderPDFPreview = this.renderPDFPreview.bind(this);
    }

    componentDidUpdate() {
        // this.refs.slider.currentSlide = 0;
    }

    handleVideoClick(oEvent) {
        let oVideoElement = oEvent.target.parentNode.children[1];
        let oOverlayElement = oEvent.target.parentNode.children[0];
        if (oVideoElement.paused) {
            oVideoElement.play();
            AppStore.setIsVideoPlaying(true);
            oOverlayElement.style.display = 'none';
        } else {
            oVideoElement.pause();
            AppStore.setIsVideoPlaying(false);
            oOverlayElement.style.display = 'block';
        }
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
            speed: 800,
            slidesToShow: 1,
            slidesToScroll: 1,
            slickGoTo: this.state.slideIndex
        };

        return (
            <div className="gallery-container">

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
                                <img className="slick-icnheightimage" src={media.url} />
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
                                    <div onClick={that.handleVideoClick} className="playpause"> </div>
                                    {(() => {
                                      if(!AppStore.isOniPadApp)  { //prohibit history manipulation in case of being displayed within an iOS app (not safari)
                                        return(<video onClick={that.handleVideoClick} className="slick-icnheightvideo" src={media.url} controls muted />);
                                      } else {
                                        return(<video onClick={that.handleVideoClick} className="slick-icnheightvideo" src={media.url} controls />);
                                      }
                                    })()}
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
                      let canvas_object = <canvas id={canvas_id} height={"400px"} width={"700px"} style={canvas_style} onClick={(oEvent) => that.props.openHandler(oEvent, media)}></canvas>;
                      let isSmallDisplay = window.innerWidth < 500;
                      if (isSmallDisplay){
                        canvas_object =  <canvas id={canvas_id} height={"400px"} width={"700px"} style={canvas_style} onClick={() => {window.open(media.url, "_blank");}}></canvas>;
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
