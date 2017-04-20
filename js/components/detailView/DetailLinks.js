require("!style!raw!sass!./detailLinks.scss");
import React from "react";
import AppStore from '../../stores/AppStore';

var Isvg = require('react-inlinesvg');

export default class DetailLinks extends React.Component {

    render () {
    	if (this.props.content.length > 0) {
        	return (
    			<div className={`detailLinks ${AppStore.getPortfolioCategory(this.props.portfolioAreaClass)} `}>
    				<h4>{this.props.title}</h4>
					<ul>
    					{
            	    	    this.props.content.map((link, index) => {
                                let iconUrl = window.icnThemePath + 'img/link_' + link.type + '.svg';

                                if (link.url) {
                	    	        return (
                    	    	        <li key={index}>
                                            <a href={link.url} target='_blank'>
                                                <Isvg src={iconUrl}/>
                                                <p className="linkTitle">
                                                    {(() => { if (link.function && window.portfolio_showContactFunction) { return (
                            	    	        	           <span className="function">{link.function}</span>
                                                    ) } })()}
                                                    <span className="title">{link.title}</span>
                                                    {(() => { if (link.logo) { return (
                                                        <img className="ContactPartnerLogo" src={link.logo} />
                                                    ) } })()}
                                                </p>
                    	    	            </a>
                    	    	        </li>
                                    );
                                } else {
                                    return (
                                        <li key={index}>
                                          <a href="javascript:;" className="emptyLinkNoPointer">
                                                <Isvg src={iconUrl}/>
                                                <p className="linkTitle">
                                                    {(() => { if (link.function && window.portfolio_showContactFunction) {
                                                        return (
                                                            <span className="function">{link.function}</span>
                                                        )
                                                    } })()}
                                                    <span className="title">{link.title}</span>
                                                    {(() => { if (link.logo) {
                                                        return (
                                                            <img className="ContactPartnerLogo" src={link.logo} />
                                                        )
                                                    } })()}
                                                </p>
                                          </a>
                                        </li>
                                    );
                                }
            	    	    })
            	    	}
        	    	</ul>
        	    </div>
        	)
        } else {
        	return (<div/>)
        }
    }
}
