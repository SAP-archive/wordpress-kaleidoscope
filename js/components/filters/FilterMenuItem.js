require("!style!raw!sass!./filtermenuitem.scss");
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from "../../stores/AppStore";
import { projects } from "../../stores/projects";

export default class FilterMenuItem extends React.Component {

    constructor(props) {
        super(props);
        this.display = 'block';
        this.state = { mounted: false };
        if(this.props.title == window.portfolio_coloredByElement) {
            this.legendClass = 'filtermenuitem__legenditem__' + AppStore.getPortfolioCategory(this.props.subFilterTitle);
        } else {
            this.legendClass = "undefined";
        }
        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.refs.filtermenuitemDisplay) {
                this.display = this.refs.filtermenuitemDisplay.style.display;
            }
            this.setState({ mounted: true });
        }, 5);
    }

    render() {
        let filterItemClasses = "filtermenuitem";
        let clickable = this.props.isPossible;
        if (this.props.isSelected) filterItemClasses += ' filtermenuitem__selected';

        let display;
        if (this.state.mounted) {
            if (this.props.isActive || this.props.isSelected) {
                display = 'block';
            } else {
                display = 'none';
            }
        }
        if (this.props.subFilterTitle) {

            let allSelectedFilters = this.props.allSelectedFilters;
            let selfFilter = Array({filterTitle: this.props.title, subFilter: this.props.subFilterTitle });
            if ((this.count === undefined )|| (!AppStore.isSearching() && !AppStore.getFilterOverview() && !AppStore.getShowNoResults())){
            if (allSelectedFilters.length == 0 ){
              this.count = projects.countFilterResults(selfFilter);
            } else if(window.portfolio_filterAsRadioButtons){

                let otherFilters = allSelectedFilters.filter(function(currentFilter){
                  return selfFilter[0].filterTitle !== currentFilter.filterTitle;
                });
                clickable = true;
                this.count = projects.countFilterResults(selfFilter.concat(otherFilters));
            } else {
                this.count = projects.countFilterResults(selfFilter.concat(allSelectedFilters));
            }
            if (clickable) filterItemClasses += ' filtermenuitem__possible';
            if(window.portfolio_filterAsRadioButtons) {
                filterItemClasses += ' filtermenuitem__asRadioButtons';
            }
        }

        return (
          <div className="filtermenuitem__height" style={{display: display}} ref='filtermenuitemDisplay'>
            <div tabIndex="2" className={filterItemClasses}
                 onClick={clickable && this.onClick}
                 onKeyDown={clickable && this.onKeyDown}>
                <span className={"filtermenuitem__legenditem "+this.legendClass}>
                    <span className={"filtermenuitem__legenditem-inner "+this.legendClass}/>
                </span>
                <span className="filtermenuitem__filtertitle">{this.props.subFilterTitle}</span>


                  {(() => { if (this.count > 0 && window.portfolio_filter_rule == "AND")  {
                      return (
                          <span className="filtermenuitem__filtercount">
                            {this.count}
                          </span>
                      )
                    } else {
                      return (
                          <span className="filtermenuitem__filtercount"></span>
                      )
                    }
                  })()}


            </div>
          </div>
        );
        }
        return null;
    }

    onKeyDown() {
        //Enter or Space
        if(event.key === 'Enter' || event.keyCode == 32) {
            this.onClick(event);
        }
        //Escape
        else if(event.keyCode == 27  && !window.portfolio_lockSidebar) {
            Actions.trigger(ActionTypes.TOGGLE_FILTER, true);
        }
    }

    onClick(event) {
        event.stopPropagation();
        Actions.trigger(ActionTypes.SWITCH_SUB_FILTER, this.props.title, this.props.subFilterTitle);
    }
}

FilterMenuItem.propTypes = {
    title: React.PropTypes.string.isRequired,
    subFilterTitle: React.PropTypes.string.isRequired
};
