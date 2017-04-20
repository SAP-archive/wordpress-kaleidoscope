
require("!style!raw!sass!./detailLifeCycleEvent.scss");
import React from "react";
import AppStore from '../../stores/AppStore';

export default class DetailLifeCycle extends React.Component {
    render() {
    	let project_lifecycle= this.props.lifecycle;
        let lc=[];
        var category = AppStore.getPortfolioCategory(this.props.portfolioAreaClass);



        project_lifecycle.sort(function(b,a) {
  			  return new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
			});
        for (var item in project_lifecycle) {


                var links = [];
                var data = new Date(project_lifecycle[item]['milestone_date']).toLocaleDateString(navigator.language, { year: 'numeric', month: 'long', day: 'numeric' });
                var n= project_lifecycle[item]['milestone_date'].toString();


                for(var i in project_lifecycle[item]['links']){

                	links.push(<a target="_blank" className= "underline_link gr-2 prefix-1"  href={project_lifecycle[item]['links'][i]['link_url']}>  {project_lifecycle[item]['links'][i]['link_title']}  </a> );


                }

                var milestone_name = project_lifecycle[item]['milestone'];
                var iconclass = milestone_name.toLowerCase().split(' ').join('_');
                lc.push(

                	<li className={`${iconclass}_${category} ${category}`}>
                	  <div>
          			  <span className="date">{project_lifecycle[item]['milestone_date']}</span>
              			<div className="container">
               		 	<div className= {`event_title ${category}`}><span className="title">{project_lifecycle[item]['milestone']}</span></div>
               		 	 <p>{project_lifecycle[item]['summary']}</p>

               		 	 {links}

               		 	</div>
               		 </div>
            		</li>

                	)

            }
        return(
        	<section className="timeline">
          <ul id="evelist">
        	{lc}
        </ul>
        </section>

        	)

    }
}
