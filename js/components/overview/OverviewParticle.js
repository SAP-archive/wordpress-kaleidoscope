require("!style!raw!sass!../particle/particle.scss");
require("!style!raw!sass!../particle/particle-animations.scss");
require('core-js');

import React from 'react';
import AppStore from '../../stores/AppStore';
import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";

export default class OverviewParticle extends React.Component {

    constructor(props) {
        super(props);

        this.animation = '';

        this._getBacklinkUrl = this._getBacklinkUrl.bind(this);
        this.handleProjectsClick = this.handleProjectsClick.bind(this);
        this.handleOverviewParticleClick = this.handleOverviewParticleClick.bind(this);

        this.isIE = this.props.isIE;
        this.is_updated = false;

        if (this.props.project.date) {
            this.is_updated = (new Date() - Date.parse(this.props.project.date.replace(" ", "T"))) / 1000 / 60 / 60 / 24 < window.updatedTimeInDays;
        }
    }

    render() {

      let classes = this.props.project.url == this.props.overview.state.currentIframe ? "selected" : "";

        return (
          <div className={`overview__particle-group ${classes}`}>
            <a href="#" className={'overview__overview-particle'} onClick={this.handleOverviewParticleClick} >
              <div className={`overview__overview-particle-inner overview__particle-${this.props.index % 6}`}>
                <h4 className="overview__overview-particle-title">
                  <div className="overview__overview-particle-title_headline">{this.props.project.title}</div>
                  <img src={this.props.project.logo} className="overview__overview-particle-logo" />
                  <div className="overview__overview-particle-title_description">{this.props.project.description}</div>
                </h4>
              </div>
            </a>
          </div>
        );
    }

    _getBacklinkUrl(url){
      let params = location.search;
      if (params.startsWith("?")){
        params = params.substr(1);
      }
      let addParams = [];
      params.split("&").forEach(function(currentParam){
        let item = currentParam.split("=");
        if (item[0].toLowerCase() !== "overview"){
          addParams.push(currentParam);
        }
      })

      var pu = document.createElement("a");
      pu.href = url;
      var vars = pu.search.substring(1).split('&');
      vars.push("backlink="+encodeURIComponent(location.href));
      vars = vars.concat(addParams);
      return pu.protocol +"//"+pu.host + "/?" + vars.join("&");
    }

    handleOverviewParticleClick() {
      this.props.overview.setState({currentIframe: this.props.target})
    }

    handleProjectsClick(event){
      location.assign('http://' + this._getBacklinkUrl(this.props.project.url));
    }
}
