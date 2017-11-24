require("!style!raw!sass!./matrix.scss");
import React from "react";
import Actions from "../../actions/Actions";
import {ActionTypes} from "../../constants/constants";
import AppStore from "../../stores/AppStore";
var Isvg = require('react-inlinesvg');


export default class Matrix extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            matrixIsVisible: false,
            filterOverview: true,
            bubble_or_text: true,
            blur: false,
            matrixXAxisDomain: window.portfolio_matrix_xaxis,
            matrixYAxisDomain: window.portfolio_matrix_yaxis,
            matrixFontDimensionDomain: window.portfolio_matrix_fontsize_dimension,
            portfolio_coloredByElement: window.portfolio_coloredByElement,
            portfolio_show_matrix_fontsize_dimension: window.portfolio_show_matrix_fontsize_dimension,
            projects: {},
            showInactiveProjects: false,
            showNoValueX: false,
            showNoValueY: false
        };
        this.filters = {};
        this.onChange = this.onChange.bind(this);
        this.handleCategoryXChange = this.handleCategoryXChange.bind(this);
        this.handleCategoryYChange = this.handleCategoryYChange.bind(this);
        this.handleCategoryFontChange = this.handleCategoryFontChange.bind(this);
        this.handleShowInactiveProjectsChange = this.handleShowInactiveProjectsChange.bind(this);
        this.handleShowNoValueY = this.handleShowNoValueY.bind(this);
        this.handleShowNoValueX = this.handleShowNoValueX.bind(this);
        this.onToggleMatrix = this.onToggleMatrix.bind(this);
        this.buildUpFiltersRelayingOnProjects();
    }

    componentDidMount() {
        AppStore.on("change", this.onChange);

    }

    componentWillUnmount() {
        AppStore.removeListener("change", this.onChange);
    }

    handleCategoryXChange(e) {
        if (e.target.value) {
            this.setState({"matrixXAxisDomain": e.target.value});
        }
    }

    handleCategoryYChange(e) {
        if (e.target.value) {
            this.setState({"matrixYAxisDomain": e.target.value});
        }
    }

    handleCategoryFontChange(e) {
        if (e.target.value) {
            this.setState({"matrixFontDimensionDomain": e.target.value});
        }
    }

    handleShowInactiveProjectsChange() {
        if (this.state.showInactiveProjects) {
            this.setState({"showInactiveProjects": false});
        } else {
            this.setState({"showInactiveProjects": true});
        }
    }

    handleShowNoValueX() {
        if (this.state.showNoValueX) {
            this.setState({"showNoValueX": false});
        } else {
            this.setState({"showNoValueX": true});
        }
    }

    handleShowNoValueY() {
        if (this.state.showNoValueY) {
            this.setState({"showNoValueY": false});
        } else {
            this.setState({"showNoValueY": true});
        }
    }

    render() {

        if (!window.portfolio_showMatrixButton){
            return null;
        }

        //############ Check for possible input errors ############
        if (!window.matrixFilters) {
            console.error("Please provide a valid array containing the wished filters for matrix-view.")
            return;
        }
        if (this.filters.length < 2) {
            console.error("Please provide a least two different filters")
            return;
        }
        if (this.state.matrixXAxisDomain != 'deactivated' && !this.filters[this.state.matrixXAxisDomain]) {
            console.error("The given domain for the matrix x-axis is invalid!");
            return;
        }
        if (this.state.matrixYAxisDomain != 'deactivated' && !this.filters[this.state.matrixYAxisDomain]) {
            console.error("The given domain for the matrix y-axis is invalid!");
            return;
        }
        if (!(this.state.matrixFontDimensionDomain == "none") && !this.filters[this.state.matrixFontDimensionDomain]) {
            console.error("The given domain for the matrix font dimension is invalid!");
            return;
        }
        if (!this.filters[this.state.portfolio_coloredByElement]) {
            console.error("The given domain for the matrix font color is invalid!");
            return;
        }

        this.updateInactiveColumns();

        //############ Set domain of every matrix axis ############
        var matrix_x_domain = [];
        var matrix_y_domain = [];
        if (this.state.matrixXAxisDomain != "deactivated") {
            matrix_x_domain = Object.assign([], this.filters[this.state.matrixXAxisDomain]);
        }
        if (this.state.matrixYAxisDomain != "deactivated") {
            matrix_y_domain = Object.assign([], this.filters[this.state.matrixYAxisDomain]);
        }
        var matrix_fontDim_domain = "none";
        if (this.state.matrixFontDimensionDomain != "none") {
            matrix_fontDim_domain = this.filters[this.state.matrixFontDimensionDomain];
        }
        var matrix_colorDim_domain = Object.keys(AppStore.getFilters()[this.state.portfolio_coloredByElement]);
        matrix_x_domain.push("noValue");
        matrix_y_domain.push("noValue");

        //############ Set up matrix and define further properties ############
        let matrix_x_size = matrix_x_domain.length;
        let matrix_y_size = matrix_y_domain.length;
        let NoValueYHasContent = false;
        let NoValueXHasContent = false;
        let matrix = {};
        let categoryCounterX = {};
        let categoryCounterY = {};
        let basic_font_dimension = 1.6;
        let step_font_dimension = 0.2;
        let font_unit = "vh";
        let that = this;
        categoryCounterX['noValue'] = 0;
        categoryCounterY['noValue'] = 0;
        let matStyle = {
            width: this.state.matrixIsVisible ? '100%' : '0%',
            height: this.state.matrixIsVisible ? '100%' : '0%'
        };
        let iconStyles = {
            display: !this.state.matrixIsVisible && !this.props.project && !this.state.blur ? 'block' : 'none'

        };
        if (matrix_fontDim_domain.length <= 4) {
            step_font_dimension = 0.4;
        }

        //############ Initialize matrix ############
        for (let yIndex = 0; yIndex < matrix_y_size; ++yIndex) {
            matrix[matrix_y_domain[yIndex]] = {};
            for (let xIndex = 0; xIndex < matrix_x_size; ++xIndex) {
                matrix[matrix_y_domain[yIndex]][matrix_x_domain[xIndex]] = [];
            }
        }

        //############ Fill in data into matrix ############
        let projects = AppStore.getProjects(); //returns also functions! For iterating only projects, use iterating over Array.length!
        for (let projectID = 0; projectID < projects.length; projectID++) {
            if (!this.state.showInactiveProjects) { //skip inactive projects if option is selected
                if ("project_state" in projects[projectID] && projects[projectID]["project_state"][0] && projects[projectID]["project_state"][0] == "Inactive") {
                    continue;
                }
            }
            let matrixXLocations = []; //collection of all possible matrix cells, where the current project fits in
            let matrixYLocations = [];
            if(this.state.showNoValueX || this.state.matrixXAxisDomain == "deactivated") {
                matrixXLocations[0] = "noValue";
            }
            if(this.state.showNoValueY || this.state.matrixYAxisDomain == "deactivated") {
                matrixYLocations[0] = "noValue";
            }
            let projectXValues = projects[projectID][this.state.matrixXAxisDomain];
            let projectYValues = projects[projectID][this.state.matrixYAxisDomain];
            if (projectXValues && projectXValues[0] && this.state.matrixXAxisDomain != "deactivated") {
                if (!(Object.prototype.toString.call(projectXValues).localeCompare("[object Array]"))) {
                    for (var c = 0; c < projectXValues.length; c++) {
                        let memberName = this.state.matrixXAxisDomain + "_name";
                        if (projectXValues[c].hasOwnProperty(memberName)) {
                            matrixXLocations[c] = projectXValues[c][memberName];
                        } else {
                            matrixXLocations[c] = projectXValues[c];
                        }
                        if (isNaN(categoryCounterX[matrixXLocations[c]])) {
                            categoryCounterX[matrixXLocations[c]] = 0;
                        }
                        if((projectYValues && projectYValues.length  > 0 && projectYValues[0]) || this.state.showNoValueY
                            || this.state.matrixYAxisDomain == "deactivated") {
                            categoryCounterX[matrixXLocations[c]]++;
                        }
                    }
                } else {
                    matrixXLocations[0] = projectXValues;
                    if (isNaN(categoryCounterX[matrixXLocations[0]])) {
                        categoryCounterX[matrixXLocations[0]] = 0;
                    }
                    if((projectYValues && projectYValues.length > 0) || this.state.showNoValueY
                        || this.state.matrixYAxisDomain == "deactivated") {
                        categoryCounterX[matrixXLocations[0]]++;
                    }
                }
            }
            if (projectYValues && projectYValues[0] && this.state.matrixYAxisDomain != "deactivated") {
                if (!(Object.prototype.toString.call(projectYValues).localeCompare("[object Array]"))) {
                    for (c = 0; c < projectYValues.length; c++) {
                        let memberName = this.state.matrixYAxisDomain + "_name";
                        if (projectYValues[c].hasOwnProperty(memberName)) {
                            matrixYLocations[c] = projectYValues[c][memberName];
                        } else {
                            matrixYLocations[c] = projectYValues[c];
                        }
                        if (isNaN(categoryCounterY[matrixYLocations[c]])) {
                            categoryCounterY[matrixYLocations[c]] = 0;
                        }
                        if((projectXValues && projectXValues.length > 0 && projectXValues[0]) || this.state.showNoValueX
                        || this.state.matrixXAxisDomain == "deactivated") {
                            categoryCounterY[matrixYLocations[c]]++;
                        }
                    }
                } else {
                    matrixYLocations[0] = projectYValues;
                    if (isNaN(categoryCounterY[matrixYLocations[0]])) {
                        categoryCounterY[matrixYLocations[0]] = 0;
                    }
                    if((projectXValues && projectXValues.length > 0) || this.state.showNoValueX ||
                        this.state.matrixXAxisDomain == "deactivated") {
                        categoryCounterY[matrixYLocations[0]]++;
                    }
                }
            }
            for (let xLocationsIndex = 0; xLocationsIndex < matrixXLocations.length; xLocationsIndex++) {
                for (let yLocationsIndex = 0; yLocationsIndex < matrixYLocations.length; yLocationsIndex++) {
                    matrix[matrixYLocations[yLocationsIndex]][matrixXLocations[xLocationsIndex]].push(projects[projectID]);
                    if (matrixXLocations[xLocationsIndex] == "noValue") {
                        NoValueXHasContent = true;
                        categoryCounterX['noValue']++;
                    }
                    if (matrixYLocations[yLocationsIndex] == "noValue"){
                        NoValueYHasContent = true;
                        categoryCounterY['noValue']++;
                    }
                }
            }
        }
        //Remove noValues row/column if empty
        if (!NoValueYHasContent  || (!this.state.showNoValueY && this.state.matrixYAxisDomain != "deactivated")) {
            delete matrix["noValue"];
        }
        if (!NoValueXHasContent || (!this.state.showNoValueX && this.state.matrixXAxisDomain != "deactivated")) {
            for (let xRow in matrix) {
                delete matrix[xRow]["noValue"];
                let noValueIndex = matrix_x_domain.indexOf("noValue");
                if (noValueIndex != -1) {
                    matrix_x_domain.splice(noValueIndex, 1);
                }
            }
        }

        class MatrixWrapper extends React.Component {
            render() {
                return <div key="Matrix" className="Matrix">
                    <MatrixDescriptionRow key="BottomDescriptionRow" data={matrix_x_domain}
                                          quantityListX={this.props.quantityListX}
                                          quantityListY={this.props.quantityListY}/>
                    <div className="innerScrollWrapper">
                        {Object.keys(this.props.rows).map((row) => (
                            <MatrixRow key={row} row={row} cells={this.props.rows[row]}
                                       quantityListX={this.props.quantityListX}
                                       quantityListY={this.props.quantityListY}/>
                        ))}
                    </div>
                </div>
            }
        }

        class MatrixRow extends React.Component {
            render() {
                return <div className="Matrix_row">
                    {(() => {
                        if (that.state.matrixYAxisDomain != 'deactivated') {
                            return (
                                <MatrixDescriptionCell key={`${this.props.cells.id}_descCell`}
                                                       data={this.props.row}
                                                       quantityList={this.props.quantityListY}/>
                            )
                        }
                    })()}
                    {Object.keys(this.props.cells).map((cell) => (
                        <MatrixCell key={cell} data={this.props.cells[cell]}/>
                    ))}
                </div>;
            }
        }

        class MatrixCell extends React.Component {

            onMatrixProjectClick(title) {
                Actions.trigger(ActionTypes.TOGGLE_MATRIX);
                Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, window.icnAllProjects.filter(function (x) {
                    return x.title == title
                }).shift());
            }

            render() {
                let projects = this.props.data.map((project) => {
                    let colorID = matrix_colorDim_domain.indexOf(project[that.state.portfolio_coloredByElement][0]);
                    if (that.state.matrixFontDimensionDomain != "none" && project[that.state.matrixFontDimensionDomain]) {
                        let font_size = basic_font_dimension + (step_font_dimension * matrix_fontDim_domain.indexOf(project[that.state.matrixFontDimensionDomain][0]));
                        let style = {
                            fontSize: font_size + font_unit,
                            lineHeight: (font_size + 0.2) + font_unit
                        };
                        return <li key={`${project.slug}_List_Line`}
                                   className={`Matrix_List_Line ${project.project_state} category_0${colorID}`}
                                   style={style}
                                   onClick={() => this.onMatrixProjectClick(project.title)}>{project.title}</li>;
                    } else {
                        return <li key={`${project.slug}_List_Line`}
                                   className={`Matrix_List_Line ${project.project_state} category_0${colorID}`}
                                   onClick={() => this.onMatrixProjectClick(project.title)}>{project.title}</li>;
                    }
                });
                return <div key={`${this.props.data.id}_MatrixCell`} className="Matrix_cell">
                    <ul key={`${this.props.data.id}_ul`} className="Matrix_List">
                        {projects}
                    </ul>
                </div>;
            }
        }

        //Last row of matrix containing axes information
        class MatrixDescriptionRow extends React.Component {
            render() {
                if (this.props.data[0] == 'noValue') {
                    return
                }
                return <div className="Matrix_row Matrix_description_row">
                    {(() => {
                        if (that.state.matrixYAxisDomain != 'deactivated') {
                            return (
                                <MatrixDescriptionCell data={""} quantityList={this.props.quantityListX}/>
                            )
                        }
                    })()}
                    {this.props.data.map((cell) => (
                        <MatrixDescriptionCell data={cell} quantityList={this.props.quantityListX}/>
                    ))}
                </div>;
            }
        }

        class MatrixDescriptionCell extends React.Component {
            render() {
                if (this.props.data == "") {
                    return <div className="Matrix_cell Matrix_description_cell emptyDescriptionCell"></div>;
                }
                let cellDescription = "(no value)";
                if (this.props.data != "noValue") cellDescription = this.props.data;
                return <div className="Matrix_cell Matrix_description_cell">
                    {cellDescription}
                    <br/>
                    <span className="number_of_elements">({this.props.quantityList[this.props.data]})</span>
                </div>;
            }
        }

        let XAxisSelectionFilters = [];
        let YAxisSelectionFilters = [];
        for (let item in Object.keys(this.filters)) {
            if (window.matrix_filters_excluded_x.indexOf(Object.keys(this.filters)[item]) == -1) {
                XAxisSelectionFilters.push(<option>{Object.keys(this.filters)[item]}</option>);
            } else {
                XAxisSelectionFilters.push(<option disabled="disabled">{Object.keys(this.filters)[item]}</option>);
            }
        }
        for (let item in Object.keys(this.filters)) {
            if (window.matrix_filters_excluded_y.indexOf(Object.keys(this.filters)[item]) == -1) {
                YAxisSelectionFilters.push(<option>{Object.keys(this.filters)[item]}</option>);
            } else {
                YAxisSelectionFilters.push(<option disabled="disabled">{Object.keys(this.filters)[item]}</option>);
            }
        }

        return (
            <div style={matStyle} className="mat printing_background">
                {(() => {
                    if (AppStore.matrixIsVisible()) {
                        return (
                            <div className="matrix_wrapper_alternative">
                                <div className="matrix_wrapper_alternative_container">
                                    <span
                                        className="matrix_wrapper_alternative_content">Please rotate the device.</span>
                                </div>
                            </div>
                        );
                    }
                })()}
                {(() => {
                    if (AppStore.matrixIsVisible()) {
                        return (
                            <div className="matrix_wrapper">
                                <div className="matrix_wrapper_fix_boxes">
                                    <MatrixWrapper rows={matrix} quantityListX={categoryCounterX}
                                                   quantityListY={categoryCounterY}/>
                                    <div className="matrix_sidebar">
                                        <div className="matrix_axis_selection">
                                            <div>
                                                <label>X-Axis</label>
                                                <select onChange={this.handleCategoryXChange}
                                                        value={this.state.matrixXAxisDomain}>
                                                    {XAxisSelectionFilters}
                                                    <option>deactivated</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>Y-Axis</label>
                                                <select onChange={this.handleCategoryYChange}
                                                        value={this.state.matrixYAxisDomain}>
                                                    {YAxisSelectionFilters}
                                                    <option>deactivated</option>
                                                </select>
                                            </div>
                                            {(() => {
                                                if (this.state.portfolio_show_matrix_fontsize_dimension) {
                                                    return (<div>
                                                        <label>Font size
                                                        </label>
                                                        <select onChange={this.handleCategoryFontChange}
                                                    value={this.state.matrixFontDimensionDomain}>
                                                    {Object.keys(this.filters).map((category) => (
                                                        <option>{category}</option>
                                                    ))}
                                                    <option>none</option>
                                                        </select></div>)
                                                }
                                            })()}
                                        </div>
                                        <div className="show_inactive_projects">
                                            <label className="checkbox_description" htmlFor="checkboxInactiveProjects">
                                                <input id="checkboxInactiveProjects" type="checkbox" onClick={this.handleShowInactiveProjectsChange}
                                                   checked={this.state.showInactiveProjects}/>
                                                Show inactive projects
                                            </label>
                                            <label className="checkbox_description" htmlFor="checkboxNoValueX">
                                                <input id="checkboxNoValueX" type="checkbox" onClick={this.handleShowNoValueX}
                                                       checked={this.state.showNoValueX}/>
                                                Show noValue X-Axis
                                            </label>
                                            <label className="checkbox_description" htmlFor="checkboxNoValueY">
                                                <input id="checkboxNoValueY" type="checkbox" onClick={this.handleShowNoValueY}
                                                       checked={this.state.showNoValueY}/>
                                                Show noValue Y-Axis
                                            </label>
                                        </div>
                                        {(() => {
                                            if (matrix_fontDim_domain != "none") {
                                                return (
                                                    <div className="matrix_font_code">
                                                        <h4>Font size</h4>
                                                        {matrix_fontDim_domain != "none" && matrix_fontDim_domain.map((category) => (
                                                            <div className="matrix_legend_category"
                                                                 style={{fontSize: (basic_font_dimension + matrix_fontDim_domain.indexOf(category) * step_font_dimension + "vh")}}>{category}</div>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                        })()}
                                        <div className="matrix_color_code">
                                            {matrix_colorDim_domain.map((color_category) => (
                                                <div
                                                    className={`matrix_legend_category matrix_legend_category_0${matrix_colorDim_domain.indexOf(color_category)}`}> {color_category}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })()}
                <div className="exit_matrix" onClick={this.onToggleMatrix}>
                    <Isvg src={window.icnThemePath + 'img/exit.svg'}/>
                </div>
            </div>
        );
    }

    onToggleMatrix() {
        Actions.trigger(ActionTypes.TOGGLE_MATRIX);
    }

    onChange() {
        this.setState({
            matrixIsVisible: AppStore.matrixIsVisible(),
            bubble_or_text: AppStore.isBubble_Or_Text(),
            filterOverview: AppStore.getFilterOverview(),
            projects: AppStore.getProjects(),
            blur: AppStore.getBlur()
        });
    }

    updateInactiveColumns() {
        if (!this.state.showInactiveProjects) {
            if ("project_state" in this.filters && this.filters["project_state"].indexOf("Inactive") > -1) {
                let inactiveIndex = this.filters["project_state"].indexOf("Inactive");
                if (inactiveIndex > -1) {
                    this.filters["project_state"].splice(inactiveIndex, 1);
                }
            }
        } else {
            if ("project_state" in this.filters && this.filters["project_state"].indexOf("Inactive") == -1) {
                this.filters["project_state"].unshift("Inactive")
            }
        }
    }

    buildUpFiltersRelayingOnProjects() {
        for (let key in window.matrixFilters) {
            let filterItem = window.matrixFilters[key];
            if (Object.prototype.toString.call(filterItem) === '[object Array]' && filterItem.length > 0) {
                this.filters[key] = filterItem;
                continue;
            }
            let filterCategory = [];
            var projects = AppStore.getProjects(); //returns also functions! For iterating only projects, use iterating over Array.length!
            for (let projectID = 0; projectID < projects.length; projectID++) {
                if (Object.prototype.toString.call(projects[projectID][key]) === '[object Array]') {
                    for (let projectValueIndex in projects[projectID][key]) {
                        let projectValue = "";
                        if (projects[projectID][key] && projects[projectID][key][projectValueIndex]) {
                            let memberName = key + "_name";
                            if (projects[projectID][key][projectValueIndex].hasOwnProperty(memberName)) {
                                projectValue = projects[projectID][key][projectValueIndex][memberName];
                            } else {
                                projectValue = projects[projectID][key][projectValueIndex];
                            }
                        }
                        if (filterCategory.indexOf(projectValue) === -1 && projectValue && projectValue !== "" && projectValue !== "noValue") {
                            filterCategory.push(projectValue);
                        }
                    }
                } else {
                    let projectValue = projects[projectID][key];
                    if (filterCategory.indexOf(projectValue) === -1 && projectValue && projectValue !== "" && projectValue !== "noValue") {
                        filterCategory.push(projectValue);
                    }
                }
            }
            this.filters[key] = filterCategory;
        }
    }
}
