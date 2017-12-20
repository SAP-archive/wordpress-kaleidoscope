require("!style!raw!sass!./detailView.scss");
import React from "react";

import Gallery from "./Gallery.js";
import DetailFactsheet from "./DetailFactsheet.js";
import DetailSection from "./DetailSection.js";
import DetailLifeCycle from "./DetailLifeCycle.js";
import DetailFooter from "./DetailFooter.js";
import DetailLinks from "./DetailLinks.js";
import DetailRelated from "./DetailRelated.js";
import TechStackSection from "./TechStackSection.js";
import DetailLightBox from "./DetailLightBox.js";

import AppStore from '../../stores/AppStore';
import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

var Isvg = require('react-inlinesvg');

export default class DetailView extends React.Component {

    constructor(props) {
        super(props);
        this.onExit = this.onExit.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.state = {
            lightboxVisible: false,
            src: null,
            scrollToTop: true
        };
        this.closeLightbox = this.closeLightbox.bind(this);
        this.openLightBox = this.openLightBox.bind(this);
        this.onFocusFocusKeeper = this.onFocusFocusKeeper.bind(this);
    }

    componentDidUpdate() {
      if (this.state.scrollToTop){
        this.scrollToTop();
      }
      if(this.headline) {
          this.headline.focus();
          this.headline.click();
      }
    }

    componentDidMount() {
    }

    closeLightbox(oEvent){
        oEvent.stopPropagation();
        this.setState({lightboxVisible: false, src:null, media:null, scrollToTop:false});
    }

    openLightBox(oEvent, mediaObject){
      oEvent.stopPropagation();
      this.setState({lightboxVisible: true, src:oEvent.target.src, media:mediaObject, scrollToTop:false});
    }

    onFocusFocusKeeper(event) {
        this.headline.focus();
    }

    render() {
        let project = this.props.project,
            hiddenClass = '';
        if (!project) {
            return (<div/>);
        }

        let allProjects = this.props.projects;
        let relatedProjects = allProjects.filter(function(singleproject) {
            return (singleproject["portfolio_area"].indexOf(project["portfolio_area"][0]) > -1) && (singleproject.slug != project.slug)
        });

        // All links that will be shown in the Links section
        var allLinks = [];
        if (project.demo_link) allLinks.push({
            title: 'Live-Demo',
            url: project.demo_link,
            type: 'url'
        });
        if (project.jam_link) allLinks.push({
            title: 'SAP Jam-Site',
            url: project.jam_link,
            type: 'url'
        });
        if (project.source_link) allLinks.push({
            title: 'GitHub',
            url: project.source_link,
            type: 'url'
        });
        if (project.other_links) {
            project.other_links.map((link, index) => {
                allLinks.push({
                    title: link.link_title,
                    url: link.link_url,
                    type: 'url'
                })
            });
        }

        // All contacts that will be shown in the Detailled contacts section
        var allContacts = [];
        if (project.contact_person) {
            project.contact_person.map((contact, index) => {
                let sUrl = "";
                if(window.portfolio_enableMailToLink) {
                    sUrl = contact.contact_email?"mailto:"+contact.contact_email:"";
                }
                allContacts.push({
                    function: contact.contact_type,
                    title: contact.contact_name,
                    url: sUrl,
                    type: 'email'
                })
            });
        }

        var dotsVisiblePartnerSection = false;
        var dotsVisibleGallerySection = true;
        var dotsVisibleRelatedProjectsSection = true;

        // All partners that will be shown in the detail view
        var allPartners = [];
        var partnerLogos = [];
        if (project.partners) {
            project.partners.map((partner, index) => {
                allPartners.push({
                    title: partner.partner_name,
                    url: partner.partner_url,
                    type: 'url',
                    logo: partner.partner_logo ? partner.partner_logo.sizes.medium : undefined
                })
            });
            project.partners.filter(function(partner) {
                return partner.partner_logo;
            }).map((partner, index) => {
                partnerLogos.push({
                    function: "Partner",
                    title: partner.partner_name,
                    type: 'image',
                    url: partner.partner_logo.sizes.thumbnail
                })
            });
        }

        // All partners that will be shown in the detail view
        var allPromoters = [];
        if (project.foerderer) {
            project.foerderer.map((promoter, index) => {
                allPromoters.push({ title: promoter.partner_name, url: promoter.partner_url, type: 'url' })
            });
        }

        // All downloads (one-pagers)
        var allDownloads = [];
        if (project.onepager) allDownloads.push({
            title: 'OnePager',
            url: project.onepager,
            type: 'download'
        });
        if (project.onepager_kiosk) allDownloads.push({
            title: 'OnePager - Public',
            url: project.onepager_kiosk,
            type: 'download'
        });

        let heroStyle = {
            backgroundImage: 'url(' + project.imageUrl + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 0',
            backgroundAttachment: 'scroll',
            backgroundSize: 'cover'
        };

        if (project.files && project.files.length > 0) {
          for (var i in project.files) {
            var file = project.files[i];
            allDownloads.push({
              title: file.file_title,
              url: file.file,
              type: 'download'
            });
          }
        }

        var category = AppStore.getPortfolioCategory(project.portfolioAreaClass);
        var editButton = null;
        if (!this.props.locked && window.portfolio_showEditButton && this.props.project.editLink) {
            var fixedLink = this.props.project.editLink.replace(/&amp;/g, '&');
            editButton = <a className={`detailview__editButton ${category}`} href={fixedLink} target="_blank">Edit</a>
        }
        var detailSections = [];
        if (window.portfolio_detailViewSections){
          window.portfolio_detailViewSections.forEach(function(item, index) {
              if (item && project[item]) {
                  var icon = "rubix_initial.svg";
                  if (index % 2) {
                      icon = "rubix_solved.svg"
                  }
                  if (item !== "lifecycle") {
                    detailSections.push(<DetailSection key={`detail-section-${item}`} title={AppStore.getTranslation(item , '')} icon={icon} html={project[item]} portfolioAreaClass={project.portfolioAreaClass}/>)
                  } else {
                    detailSections.push(<DetailLifeCycle key={`detail-lifecycle-${item}`} title="Project Lifecycle" icon={icon} lifecycle={project[item]} portfolioAreaClass={project.portfolioAreaClass}/>)
                  }
              }
          });
        }

        // disable horizontal scrolling in the detailview
        let disableScrolling = this.state.lightboxVisible ? "hidden" : "visible";

        let styles = {
          maxWidth: "100% !important",
          width:"100% !important",
          overflowX:"hidden",
          overflowY: disableScrolling
        };

        let title_classes = "head head-dark gr-5 prefix-1 gr-8@mobile gr-6@tablet";
        if (project.tagline_color_light){
          title_classes = "head head-light-color gr-5 prefix-1 gr-8@mobile gr-6@tablet";
        }

        return (
            <div className="detailviewWrapper" onMouseDown={() => {window.galleryMouseMove = false;}}>
              {editButton}

              <div onClick={this.onExit} tabIndex="1" id="detail-view-exit-button-wrapper">
                <div className={`detailview__exitbutton ${category}`} onClick={this.onExit}>
                  <Isvg src={window.icnThemePath + 'img/exit.svg'}/>
                  <span className="detailview__exitbutton__overlay" onClick={this.onExit} />
                </div>
              </div>

              <DetailLightBox closeHandler={this.closeLightbox} visibility={this.state.lightboxVisible} media={this.state.media}/>

              <div className={`detailview ${hiddenClass} ${category}`} onClick={this.onExit} ref="scrollView" id="detailview-main-container" style={styles}>
                <div className="detailview__scrollcontainer" onClick={(e)=>e.stopPropagation()}>
                  <div className={`detailview__hero ${category}`}>
                      <div className="detailview__heroImage row" style={heroStyle}>
                          <div className={title_classes}>
                              {(() => { if (project.sap_clea_branded_project && project.sap_clea_branded_project != "no") {
                                  return (
                                    <div className="SAPclea__brand">
                                        <Isvg src={window.icnThemePath + 'img/sap_clea_'+project.sap_clea_branded_project+'.svg'}/>
                                    </div>
                                  );
                              } })()}
                            {(() => { if (project.tagline) { return (
                                          <div>
                                              <h2 dangerouslySetInnerHTML={{__html:this.props.project.title}} />
                                              <h1 dangerouslySetInnerHTML={{__html:this.props.project.tagline}}
                                                  ref={(input) => { this.headline = input; }}
                                                  tabIndex="1"/>
                                          </div>
                                          ) } else { return (
                                          <div>
                                              <h1 dangerouslySetInnerHTML={{__html:this.props.project.title}}
                                                  ref={(input) => { this.headline = input; }}
                                                  tabIndex="1"/>
                                          </div>
                                        ) } })()}
                          </div>
                      </div>
                  </div>
                  <div className="detailview__content container">

                      <div className="detailview__content__section">
                          <div className="detailview__banner">
                            {(() => { if (project.banner_sticker_content) {
                                let bannerStyle = category;
                                if(project.invert_banner_text_color)    {
                                    bannerStyle += " banner_inverted";
                                }
                                return (
                                    <div className={`detailview__banner_sticker ${bannerStyle}`} dangerouslySetInnerHTML={{__html:project.banner_sticker_content}}/>
                                ); }})()}
                          </div>
                          <div className="row">
                              <div className="gr-6 prefix-1 gr-11@mobile">
                                  <h3>{AppStore.getTranslation('AT_A_GLANCE', 'At a glance')}</h3>
                              </div>
                          </div>
                          <div className="row">
                            {(() => { if (!project.aboutProject) { return (
                            <div className="gr-6 prefix-1 gr-11@tablet gr-11@mobile">
                                <div className="detailview__content__text gr-11 prefix-1 gr-11@tablet prefix-0@tablet gr-11@mobile prefix-0@mobile" dangerouslySetInnerHTML={{__html:project.description}}/>
                            </div>
                            ); } else { return (
                            <div className="gr-9 prefix-1 gr-11@tablet gr-11@mobile">
                                <div className="detailview__content__text gr-11 prefix-1 gr-11@tablet prefix-0@tablet gr-11@mobile prefix-0@mobile" dangerouslySetInnerHTML={{__html:project.description}}/>
                            </div>
                            ); }})()}

                            {/* DetailFactsheet */}
                            {(() => { if (!project.aboutProject) { return (
                            <div className="gr-4 prefix-1 gr-11@tablet gr-11@mobile">
                                <DetailFactsheet project={project} locked={this.props.locked}/>
                            </div>
                            ); } })()}
                          </div>
                      </div>

                      {/* --- Gallery --- */}
                      {(() => { if (project.gallery) { return (
                        <div className="detailview__content__section row">
                            <div className="detailview__content__gallery gr-8 prefix-2 suffix-2">
                                <Gallery gallery={project.gallery}
                                         dotsVisible={dotsVisibleGallerySection}
                                         openHandler={this.openLightBox}
                                         project={project} />
                            </div>
                        </div>
                      ) } })()}

                      {detailSections}

                      {/* --- Technology Stack --- */}
                      <TechStackSection technology={this.props.project.technology}/>


                      {/* --- Onepager downloads or links in kiosk mode --- */}
                      {(() => { if ((!this.props.locked || !window.lockEnabled) && (allLinks.length > 0 || allContacts.length > 0 || allPartners.length > 0 || allPromoters.length > 0 || allDownloads.length > 0 || partnerLogos.length > 0)) { return (
                        <div className="detailview__content__section">
                            <div className="row">
                                <div className="gr-6 prefix-1 gr-10@mobile">
                                    <h3>{AppStore.getTranslation('add_info', 'Additional Information')}</h3></div>
                            </div>
                            <div className="row">
                                <div className="detailview__content__text prefix-1 gr-3 gr-10@tablet suffix-1@tablet gr-10@mobile suffix-1@mobile">
                                    <DetailLinks title={AppStore.getTranslation( 'links', 'Links')} content={allLinks} portfolioAreaClass={project.portfolioAreaClass}/>
                                    <DetailLinks title={AppStore.getTranslation( 'contacts_person', 'Contacts')} content={allContacts} portfolioAreaClass={project.portfolioAreaClass}/>
                                </div>
                                <div className="detailview__content__text prefix-1 gr-3 gr-10@tablet suffix-1@tablet gr-10@mobile suffix-1@mobile">
                                    <DetailLinks title={AppStore.getTranslation( 'partner', 'Partner')} content={allPartners} portfolioAreaClass={project.portfolioAreaClass}/>
                                    <DetailLinks title={AppStore.getTranslation( 'promoter', 'F&ouml;rderer')} content={allPromoters} portfolioAreaClass={project.portfolioAreaClass}/>
                                    <DetailLinks title={AppStore.getTranslation( 'downloads', 'Downloads')} content={allDownloads} portfolioAreaClass={project.portfolioAreaClass}/>
                                </div>
                            </div>
                        </div>
                      ); } else { return (
                        <div className="detailview__content__section detailview__content__section__small">
                            <div className="row" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                <div className={`request_info_button ${category}`} onClick={()=> {
                                  if(!AppStore.isOniPadApp()) {
                                    this.onToggleFeedback({category:AppStore.getPortfolioCategory(project.portfolioAreaClass),title:project.title,slug:project.slug,contacts:JSON.stringify(project.contact_person),interest:'info',col:window.getComputedStyle(document.getElementsByTagName("h1")[0]).color});
                                  } else {
                                    alert("Requesting more information is not possible on the iPad app.");
                                  }}}>
                                    <span className="typeform-share button" data-mode="1">Request more information</span>
                                </div>
                            </div>
                        </div>
                      ); } })()}

                      {/* --- Related Projects --- */}
                      {(() => { if (!project.aboutProject) { return (
                        <DetailRelated projects={relatedProjects} dotsEnabled={dotsVisibleRelatedProjectsSection} portfolioAreaClass={project.portfolioAreaClass} isIE={this.props.isIE}/> );
                      } })()}
                    </div>

                    <DetailFooter portfolioAreaClass={ project.portfolioAreaClass } scrollToTop={ this.scrollToTop } />

                  </div>
                  <a href="#" id="focusKeeper" onFocus={this.onFocusFocusKeeper}/>
              </div>
            </div>
        );
    }

    onExit() {
        if(!window.galleryMouseMove) {
            if (AppStore.isMatrix_DetailView()) {
                Actions.trigger(ActionTypes.EXIT_MATRIX_DETAIL_VIEW);
            } else {
                Actions.trigger(ActionTypes.EXIT_DETAIL_VIEW);
            }
        }
    }

    scrollToTop() {
        setTimeout(() => {
            if (!!this.refs.scrollView && !!this.refs.scrollView.scrollTop && this.refs.scrollView.scrollTop > 0) {
                this.refs.scrollView.scrollTop = 0;
                this.scrollToTop();
            }
        }, 1);
    }

    onToggleFeedback(feedbackObject) {
        Actions.trigger(ActionTypes.TOGGLE_FEEDBACK, feedbackObject);
    }
}
