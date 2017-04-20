require("!style!raw!sass!./TechStackSection.scss");
import React from "react";

export default class TechStackSection extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    render() {
        let technology = this.props.technology;
        if (technology && technology.length > 0 && technology[0]) {
            return (
                <div className = "detailview__content__section">
                  <div className = "row">
                    <div className = "gr-10 prefix-1">
                      <h3> Technology Stack </h3>
                    </div>
                  </div>
                  <div className = "row">
                    <div className = "gr-10 prefix-1"> {
                      technology.map((tech, index) => {
                        if (tech) {
                            return (
                              <div key={`tech-stack-${index}`} className = "technology_stack_item">
                                <div className = "technology_stack_item_logo">
                                  <img src={tech.logo.url} />
                                </div>
                                <div className="technology_stack_item_title">
                                  {tech.technology_name}
                                </div>
                              </div>
                            );
                        }
                      })
                    }
                    </div>
                  </div>
                </div>
            )
        } else {
            return null;
        }
    }
    onClick(techName) {
        window.location.href=document.location.origin + "/?technology="+techName;
    }
}
