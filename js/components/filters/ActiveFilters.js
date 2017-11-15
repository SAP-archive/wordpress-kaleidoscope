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
        let contactAllButton; 

        if (!this.props.locked && window.portfolio_showCopyLinkButton) {
            copyLink = <FilterTag key='1' title='' subFilterTitle='copy link'/>;
        } else {
            copyLink = null;
        }
        if (!this.props.locked ) {
            contactAllButton = <FilterTag key='2' title='' subFilterTitle='contact all'/>;
        } else {
            contactAllButton = null;
        }

        let isMobile = IS_MOBILE();

        if (isMobile){
          return null;
        } else {
          return (
             <div className={`activefilters ${classes}`} style={this.position}>
                 {
                     lockedFilters.map((filter, index)=> {
                        if (!window.showFilterTags) {
                            return null;
                        }
                        return (
                            <FilterTag key={index}
                                       title={filter.filterTitle}
                                        subFilterTitle={filter.subFilter}/>
                        );
                     })
                 }

                 {(() => {

                    return [
                        <FilterTag key='0' title='' subFilterTitle='reset filters'/>, 
                        copyLink, 
                        contactAllButton,
                        lockedFilters.length === 1 && AppStore.getFilterDescription(lockedFilters[0].subFilter) ? <p key='3'><b>{lockedFilters[0].subFilter}:</b> {AppStore.getFilterDescription(lockedFilters[0].subFilter)}</p> : ''
                        ];
                 })()}
             </div>
         );
       }
    }
}
