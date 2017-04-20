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

        this.isIE = this.props.isIE;
        this.is_updated = false;

        if (this.props.project.date) {
            this.is_updated = (new Date() - Date.parse(this.props.project.date.replace(" ", "T"))) / 1000 / 60 / 60 / 24 < window.updatedTimeInDays;
        }
    }

    render() {

        return (
          <div className="overview__particle-group">
            <a href={'http://' + this._getBacklinkUrl(this.props.project.url)}
              className={'overview__overview-particle'}>
              <div className={`overview__overview-particle-inner overview__particle-${this.props.index % 6}`}>
                <h4 className="overview__overview-particle-title">
                  {this.props.project.title}
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
      return url + "?backlink=" + encodeURIComponent(location.href) + "&" + addParams.join("&");
    }

    handleProjectsClick(event){
      location.assign('http://' + this._getBacklinkUrl(this.props.project.url));
    }
}
