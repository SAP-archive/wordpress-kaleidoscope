require("!style!raw!sass!./detailRelated.scss");
import React from "react";

import Slider from 'react-slick';
import DetailBubble from "./DetailBubble.js";
import AppStore from '../../stores/AppStore';

import Actions from "../../actions/Actions";
import { ActionTypes, PARTICLE_SIZE } from '../../constants/constants';

export default class DetailRelated extends React.Component {
    render() {
        var settings = {
            dots: this.props.dotsEnabled,
            adaptiveHeight: false,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            variableWidth: true,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    dots: false
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                }
            }]
        };

        let styles = {
            width: `${PARTICLE_SIZE()}px`,
            height: `${PARTICLE_SIZE()}px`,
            transform: `scale(0.8) translateZ(0)`,
        };

        let isIE = this.props.isIE;

        if (this.props.projects.length > 0) {
            return (
                <div className="detailview__content__section">
                <div className="row">
                    <div className="gr-6 prefix-1"><h3>{AppStore.getTranslation('more_projects', 'More Projects')} </h3></div>
                </div>
                <div className="row">
                    <div className="detailview__related__slider gr-10 prefix-1 suffix-1 prefix-2@mobile gr-8@mobile suffix-2@mobile">

                        <Slider {...settings}>
                            {
                                this.props.projects.map((project, index) => {

                                    let backgroundImageSrc = project.imageUrl;
                                    if (project.bubble_background) {
                                        backgroundImageSrc = project.bubble_background.url;
                                    }
                                    let backgroundUrl = `url(${backgroundImageSrc})`;

                                    function onClick (event) {
                                        event.preventDefault();
                                        Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, project);
                                    }

                                    let background = (
                                      <div className='particle__inner-container'>
                                        <div className={`particle__inner-background particle__${AppStore.getPortfolioCategory(project.portfolioAreaClass)}`} style={{backgroundImage: backgroundUrl}} />
                                      </div>
                                    );

                                    if (isIE) {
                                        background = (
                                          <div className={`particle_background_tint__category particle_background_tint__${AppStore.getPortfolioCategory(project.portfolioAreaClass)}` }>
                                            <img className="particle_background_image" src = { backgroundImageSrc }/>
                                          </div>
                                        );
                                    }

                                    return(
                                        <div key={index}>
                                            <a href={'/'+project.slug} className={'particle big'} style={styles} onClick={onClick}>
                                              <div className={`particle__inner particle__${AppStore.getPortfolioCategory(project.portfolioAreaClass)}`}>
                                                  {background}
                                                  <div className="particle__inner-table">
                                                      <h4 className="particle__inner-heading">{project.title}</h4>
                                                  </div>
                                              </div>
                                            </a>
                                        </div>
                                    )
                                })
                            }
                        </Slider>

                    </div>
                </div>
            </div>
            )
        } else {
            return null
        }
    }
}
