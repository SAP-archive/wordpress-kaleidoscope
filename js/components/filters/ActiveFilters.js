import './activefilters.css';
import React from "react";
import AppStore from '../../stores/AppStore';
import FilterTag from "./FilterTag";
import { IS_MOBILE } from "../../constants/constants";


export default class ActiveFilters extends React.Component {

    constructor(props) {
        super(props);
        let distancer = 240;
        this.position = {
            // width: window.innerWidth - distancer - 70 + 'px'
        };
    }

    render() {
        let lockedFilters = this.props.lockedFilters;
        let isActive = lockedFilters.length > 0;
        let classes = isActive && !this.props.hideFilters ? 'activefilters__active' : '';
        let copyLink;

        if (!this.props.locked) {
            copyLink = <FilterTag title='' subFilterTitle='copy link'/>;
        } else {
            copyLink = null;
        }

        let isMobile = IS_MOBILE();

        if (isMobile){
          return null;
        } else {
          return (
             <div className={`activefilters ${classes}`} style={this.position}>
                 {
                     lockedFilters.map((filter, index)=> {
                         return (
                             <FilterTag key={index}
                                        title={filter.filterTitle}
                                        subFilterTitle={filter.subFilter}/>
                         );
                     })
                 }
                 {(() => {
                     if (lockedFilters.length === 1) {
                         return [copyLink,<p>{AppStore.getFilterDescription(lockedFilters[0].subFilter)}</p>];
                     } else if (lockedFilters.length > 1) {
                         return [<FilterTag title='' subFilterTitle='clear all'/>,    copyLink]
                     }
                 })()}
             </div>
         );
       }
    }
}
