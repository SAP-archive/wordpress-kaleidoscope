require("!style!raw!sass!./detailLifeCycle.scss");
import React from "react";
import DetailLifeCycleItem from "./DetailLifeCycleItem.js";
import DetailBubble from "./DetailBubble.js";
import DetailLifeCycleEvent from "./DetailLifeCycleEvent.js";

export default class DetailLifeCycle extends React.Component {
    render() {



        return (

      <div className="detailview__content__section">
        <div className="row">
                 <div className="gr-6 prefix-1">
                    <h3>Project Lifecycle</h3>
                </div>
                <DetailLifeCycleEvent lifecycle={this.props.lifecycle} portfolioAreaClass={this.props.portfolioAreaClass}/>
        </div>




        </div>



        )
    }
}
