import "./mainfilter.css";
import React from "react";
import FilterMenuItem from "./FilterMenuItem";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from '../../stores/AppStore';


export default class MainFilter extends React.Component {

    constructor(props) {
        super(props);


        this.titleMapsTo = function(filters, title) {
            var caption;
            if (Array.isArray(filters)) {
                caption = filters.filter(f => {
                    return !!f.title & f.title.toLowerCase() == title.toLowerCase();
                }).map(f => {
                    return !!f.caption ? f.caption : f.title;
                })[0];
            }
            return !!caption ? caption : title;
        }(window.mainFilters, this.props.title);

        this.subFilters = Object.keys(this.props.filter);
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    render() {
        let isActive = this.props.isActive;
        let classes = isActive ? 'mainfilter__active' : '';

        let selectedFilters = this.props.lockedFilters.map((filter) => {
            if (filter.filterTitle === this.props.title) {
                return filter.subFilter;
            }
        });

        return (
            <div className={`mainfilter ${classes}`}>
                <div tabIndex="2" className="mainfilter__title"
                     onClick={this.onClick}
                     onKeyDown={this.onKeyDown}>
                    <span>{this.titleMapsTo}</span>
                    <span className="mainfilter__triangle"/>
                </div>
                <div>
                    {
                        this.subFilters.map((subFilter, index)=> {
                            let isPossible = this.props.filter[subFilter].possible;
                            let isSelected = selectedFilters.indexOf(subFilter) > -1;
                            return (
                                <FilterMenuItem key={index}
                                                isActive={isActive}
                                                isSelected={isSelected}
                                                isPossible={isPossible}
                                                title={this.props.title}
                                                subFilterTitle={subFilter}
                                                allSelectedFilters={this.props.lockedFilters}/>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    onClick(event) {
        event.stopPropagation();
        Actions.trigger(ActionTypes.SET_SINGLE_FILTER, this.props.title);
    }

    onKeyDown(event) {
        //Enter or Space
        if(event.key === 'Enter' || event.keyCode == 32) {
            this.onClick(event);
        }
        else if(event.keyCode === 27 && !window.portfolio_lockSidebar) {
            console.log("Escape");
            Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
        }
    }
}
