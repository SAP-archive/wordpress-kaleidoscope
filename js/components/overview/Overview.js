import "!style!raw!sass!./overview.scss"
import React from "react";

import Slider from 'react-slick';

import OverviewParticle from './OverviewParticle';

import { PARTICLE_SIZE } from './OverviewParticle';
import Actions from "../../actions/Actions";
import AppStore from '../../stores/AppStore';

export default class Overview extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentDidUpdate() {

    }

    render() {
        let overviewData = AppStore.getOverviewData();

        let sliderSettings = {
            dots: false,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
        };

        return (
          <div className='overview__container'>

            <img id="icnLogo"
                alt="Innovation Center Network"
                src={window.icnThemePath + "img/ICP_logo.png"}
                className="overview_logo"
                style={{cursor:"default"}}
                />

            <img src={window.icnThemePath + 'img/logo_gray.svg'} alt="SAP" id="sapLogo" className="filterSapLogo"/>

              <div className='overview__inner'>
                  <Slider {...sliderSettings} ref="slider" className="overview__slider">
                    {
                      overviewData.map((oProject, iIndex) => {
                        oProject.overviewCat = (iIndex%6 < 10) ? ("0" + iIndex % 6) : iIndex % 6;
                        oProject.slug = oProject.url;

                            return (
                              <div key={iIndex}>
                                  <OverviewParticle
                                      project={oProject}
                                      index={iIndex}
                                      key={iIndex}
                                      focus={this.state}
                                      isIE={this.props.isIE}
                                      target={oProject.url} />
                              </div>
                            );
                        })
                    }
                  </Slider>
              </div>
          </div>
        );
    }

}


Overview.propTypes = {
    // areas: React.PropTypes.array.isRequired,
    size: React.PropTypes.object.isRequired
};
