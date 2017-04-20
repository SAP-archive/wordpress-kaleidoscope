require("!style!raw!sass!./detailLifeCycleItem.scss");
import React from "react";
import AppStore from '../../stores/AppStore';

import DetailBubble from "./DetailBubble.js";

export default class DetailLifeCycleItem extends React.Component {
    render() {

        let project_lifecycle= this.props.lifecycle;
        let lc=[];




        project_lifecycle.sort(function(a,b) {
  			  return new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
			});
        for (var item in project_lifecycle) {


                var links = [];
                var data = new Date(project_lifecycle[item]['milestone_date']).toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' });
                for(var i in project_lifecycle[item]['links']){

                	links.push(<a target="_blank" className= "gr-10 prefix-1 prefix-1"  href={project_lifecycle[item]['links'][i]['link_url']}> <span className= "hvr-underline-from-center" > {project_lifecycle[item]['links'][i]['link_title']} </span> </a> );


                }

                lc.push(

                	<tr>
                    	<td width= "150" >
                    	    {project_lifecycle[item]['milestone']}
                    	</td>
                    	<td width= "100">
                    	    {project_lifecycle[item]['milestone_date']}
                    	</td>
                    	<td className="summary" width= "350">
                    	    {project_lifecycle[item]['summary']}
                    	</td>
                    	<td width= "200">
                    	    {links}
                    	</td>
					</tr>
                    );



        }

        return (
        <table className="lctable">
       		<tbody>
       			<tr>
            		<th className={`${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)}`} ><b>Milestone </b></th>
            		<th  className={`${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)}`}><b>Date</b></th>
            		<th  className={`${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)}`} ><b>Summary</b></th>
            		<th  className={`${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)}`}><b>Links</b></th>
       			</tr>
        		{lc}
        	</tbody>
        </table>

        )
    }
}
