require("!style!raw!sass!./detailFactsheet.scss");
import React from "react";
import AppStore from '../../stores/AppStore';
import DetailFactItem from "./DetailFactItem.js";

export default class DetailFactsheet extends React.Component {
    render() {


        let project = this.props.project;
        let detailFactSheetItems = [];
        let visibleItems;
        if (this.props.locked) {
            visibleItems = window.portfolio_factSheetItemsLocked;
        } else {
            visibleItems = window.portfolio_factSheetItems;
        }

        let factIndex = 0;
        visibleItems.forEach(function (item) {
            let content = [];
            if (project[item]) {
                if (!Array.isArray(project[item])) {
                    project[item] = [project[item]];
                }
                let contentItemIndex = 0;
                project[item].forEach(function (contentItem, index) {
                    if (contentItem) {
                        var dateCheck = Date.parse(contentItem);
                        if (isNaN(dateCheck) === false) {
                            contentItem = new Date(contentItem).toLocaleDateString(navigator.language, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        }
                        let factValue = null;
                        if (typeof contentItem === 'object' && contentItem !== null && contentItem.hasOwnProperty("contact_name")){
                          factValue = contentItem.contact_name;
                        } else {
                          factValue = contentItem;
                        }
                        content.push(<span key={`factsheetItemValue-${contentItemIndex}`}
                                           className="factsheetItemValue">{factValue}</span>);
                    }
                    contentItemIndex += 1;
                });
                if (content.length > 0) {
                    detailFactSheetItems.push(
                        <DetailFactItem key={factIndex} portfolioAreaClass={project.portfolioAreaClass}
                                        icon={window.icnThemePath + 'img/icon_' + item + '.svg'}>
                            <b>{AppStore.getTranslation(item, item.split("_").map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(" "))}</b>
                            {content}
                        </DetailFactItem>)
                    }
                }
            factIndex += 1;
        });

        return (
            <div className="detailview__fact__area row">
                {detailFactSheetItems}
            </div>
        );
    }
}
