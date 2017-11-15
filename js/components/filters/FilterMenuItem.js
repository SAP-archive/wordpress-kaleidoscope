require("!style!raw!sass!./filtermenuitem.scss");
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from "../../stores/AppStore";
import { projects } from "../../stores/projects";
import PropTypes from 'prop-types';

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
            if (this.filtermenuitemDisplay) {
                this.display = this.filtermenuitemDisplay.style.maxHeight;
            }
            this.setState({ mounted: true });
        }, 5);
    }

    componentWillUnmount() {
        this.filtermenuitemDisplay.style.maxHeight = '0';
    }

    render() {
        let filterItemClasses = "filtermenuitem";
        let clickable = this.props.isPossible;
        if (this.props.isSelected) filterItemClasses += ' filtermenuitem__selected';

        let display;
        if (this.state.mounted) {
            if (this.props.isActive || this.props.isSelected) {
                display = '100px';
            } else {
                display = '0';
            }
        }
        if (this.props.subFilterTitle) {
            let allSelectedFilters = this.props.allSelectedFilters;
            let selfFilter = Array({filterTitle: this.props.title, subFilter: this.props.subFilterTitle });
            if ((this.count === undefined )|| (!AppStore.isSearching() && !AppStore.getFilterOverview() && !AppStore.getShowNoResults())){
            if (allSelectedFilters.length === 0 ){
              this.count = projects.countFilterResults(selfFilter);
            } else if(window.portfolio_filterAsRadioButtons || window.portfolio_filter_rule === 'OR'){

                let otherFilters = allSelectedFilters.filter(function(currentFilter){
                  return selfFilter[0].filterTitle !== currentFilter.filterTitle;
                });
                clickable = true;
                this.count = projects.countFilterResults(selfFilter.concat(otherFilters));
            } else {
                this.count = projects.countFilterResults(selfFilter.concat(allSelectedFilters));
            }
            if(window.portfolio_filterAsRadioButtons) {
                filterItemClasses += ' filtermenuitem__asRadioButtons';
            }
        }

        if(this.count > 0 || this.props.isSelected) {
            clickable = true;
        } else if(this.count === 0 && !this.props.isSelected) {
                clickable = false;
        }
        if (clickable) {
            filterItemClasses += ' filtermenuitem__possible';
        }

        return (
          <div className="filtermenuitem__height" style={{maxHeight: display}}
               ref={(input) => {this.filtermenuitemDisplay = input;}}>
            <div tabIndex="2" className={filterItemClasses}
                 onClick={clickable ? this.onClick : null}
                 onKeyDown={clickable ? this.onKeyDown : null}>
                <span className={"filtermenuitem__legenditem "+this.legendClass}>
                    <span className={"filtermenuitem__legenditem-inner "+this.legendClass}/>
                </span>
                <span className="filtermenuitem__filtertitle">{this.props.subFilterTitle}</span>


                  {(() => { if (this.count > 0)  {
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
    title: PropTypes.string.isRequired,
    subFilterTitle: PropTypes.string.isRequired
};
