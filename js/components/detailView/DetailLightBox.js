require("!style!raw!sass!./DetailLightBox.scss");
import React from "react";

var Isvg = require('react-inlinesvg');

export default class DetailLightBox extends React.Component {

  constructor(props) {
      super(props);
  }

  render(){
    let image = "";
    let lightboxVisibility = this.props.visibility ? "visible" : "hidden";
    let opacityLevel = this.props.visibility ? 1 : 0;
    let styles = {
      opacity: opacityLevel,
      transition: "opacity 0.5s"
    }

    let url = null;
    let isImg = null, isPDF = null;
    let inner = "";
    if (this.props.media){
      url = this.props.media.url;
      isImg = this.props.media.type === "image";
      isPDF = this.props.media.type === "pdf" || this.props.media.type === 'application';
    }

    let pdfWidth = window.innerWidth * 4/5;
    let pdfHeight = window.innerHeight * 9/10;
    if (window.innerHeight * 1/10 < 100){
      pdfHeight = window.innerHeight - 150;
    }

    let pdfContainerStyles = {
      width: `${pdfWidth}px`,
      height:`${pdfHeight}px`,
      position:"absolute",
      top:0,
      bottom:0,
      left:0,
      right:0,
      margin:"auto",
      backgroundColor: "#9c9891",
      borderRadius: "6px",
      padding: "6px"
    }

    if (window.portfolio_enableImgLightbox && isImg){
      return (
        <div>
        <div className={"detailview__exitbutton category_XX"} style={{zIndex: 9999}} onClick={this.props.closeHandler}>
          <Isvg src={window.icnThemePath + 'img/exit.svg'} onClick={this.props.closeHandler}/>
        </div>
          <div className="lightbox" style={{visibility:lightboxVisibility, transition: "visibility 0.5s"}}>
            <div className="lightbox-background lightbox-fade" style={styles} onClick={this.props.closeHandler}></div>
              <div className="lightbox-content lightbox-fade" onClick={this.props.closeHandler}>
                <span className="lightbox-helper"></span>
                <img className="lightbox-image lightbox-fade" style={styles} src={url} />
                <div className="lightbox-caption">
                  {this.props.media.caption}
                </div>
              </div>
          </div>
        </div>
      );
    } else if (isPDF){

      let pdfViewerUrl = "/wp-content/themes/kaleidoscope/pdf_viewer/web/viewer.html?file=" + url;
      let fallback_msg = <p style={{position: "relative", margin: "0", height:"60px"}}>We&#39;re sorry, your browser can not render the PDF. Please get it <a href={url}>here</a>.</p>;
      let pdf_object =  <iframe style={{border:"1px solid black"}} title="PDF" scrolling="no" src={pdfViewerUrl} frameBorder="1" height="100%" width="100%" >{fallback_msg}</iframe>

      return (
        <div>
          <div className={"detailview__exitbutton category_XX"} style={{zIndex: 9999}} onClick={this.props.closeHandler}>
            <Isvg src={window.icnThemePath + 'img/exit.svg'} onClick={this.props.closeHandler}/>
          </div>

          <div className="lightbox" style={{visibility:lightboxVisibility, transition: "visibility 0.5s"}}>
            <div className="lightbox-background lightbox-fade" style={styles} onClick={this.props.closeHandler}></div>
              <div className="lightbox-content lightbox-fade" onClick={this.props.closeHandler}>
                <div>

                  <div style={pdfContainerStyles}>
                    <div style={{width:"100%", height:"100%"}}>
                      {pdf_object}
                    </div>
                  </div>

                </div>
              </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="lightbox" style={{visibility:lightboxVisibility, transition: "visibility 0.5s"}}>
          <div className="lightbox-background lightbox-fade" style={styles} onClick={this.props.closeHandler}></div>
            <div className="lightbox-content lightbox-fade" onClick={this.props.closeHandler}>
            </div>
        </div>
      );
    }
  }
}
