import './search.css';
import React from "react";

import Actions from "../../actions/Actions";
import { ActionTypes } from "../../constants/constants";
import AppStore from "../../stores/AppStore";
import Autosuggest from 'react-autosuggest';

var Isvg = require('react-inlinesvg');



let allSuggestions = [];

export default class Search extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            searchTerm: ''
        };
        allSuggestions = window.icnAllProjects.map(function(x) {
            return { text: x.title }
        });
        
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onToggleSearch = this.onToggleSearch.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onClearSearch = this.onClearSearch.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);

        this.suggestions = [];
    }

    componentDidMount() {
        AppStore.on("change", this.onChange);
    }

    componentWillUnmount() {
        AppStore.removeListener("change", this.onChange);
    }

    componentDidUpdate() {
        setTimeout((() => {
            if (this.refs.search && this.refs.search.input) {
                this.refs.search.input.focus();
            }
        }));
    }

    getSuggestions(value) {
        const inputValues = value.value.trim().toLowerCase().split(" ");
        const inputLength = value.value.trim().length;
        return inputLength === 0 ? [] : allSuggestions.map(function(sug) {
            let searchTitle = sug.text.toLowerCase().replace(/[^a-zA-Z +]/g, "").replace(/\s\s+/g, ' ').split(" ");
            let searchKeywords = [];
            if (sug.keywords) {
                searchKeywords = sug.keywords.map(word => (word.toLowerCase()));
            }
            let searchWords = searchTitle.concat(searchKeywords);
            let anyLetter = false;
            // use each word separately:
            inputValues.forEach(function(inputWord){
              anyLetter = (anyLetter || searchWords.some( word => (word.slice(0, inputWord.length) == inputWord)));
            })
            // anyLetter = searchWords.find(word => (word.indexOf(inputValues) >= 0));

            if (anyLetter) {
                return {
                    text: sug.text,
                    keyword: (searchTitle.indexOf(anyLetter) >= 0) ? null : anyLetter,
                }
            }
        }).filter(function(sug) {
            return sug !== undefined;
        }).sort(function(a, b) {
          return a.text<b.text?-1:(b.text<a.text?1 : 0);
        });
    }

    getSuggestionValue(suggestion) {
        return suggestion.text;
    }

    onSuggestionsFetchRequested(value) {
        this.suggestions = this.getSuggestions(value);
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.suggestions = [];
    }

    renderSuggestion(suggestion) {

        if (suggestion.keyword) {
            return ( <span> { suggestion.text } <span className = "search__suggestion_keyword" > { suggestion.keyword } </span></span > );
        } else {
            return <span> { suggestion.text } </span>;
        }

    }

    onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method }) {
        this.onToggleSearch(event);
        if (typeof _paq !== "undefined") {
            _paq.push(['trackSiteSearch', suggestion.text, false, false]);
        }
        Actions.trigger(ActionTypes.INIT_DETAIL_VIEW, window.icnAllProjects.filter(function(x) {
            return x.title == suggestion.text }).shift());
    }

    render() {
        let styles = {
            display: this.state.searching && window.portfolio_showSearchButton ? 'block' : 'none'
        };


        let inputProps = {
            placeholder: "Search...",
            value: this.state.searchTerm,
            onChange: this.onSearch,
            className: "search__box-input"
        };


        return ( 
            <div className = "search" >
                <div className = "search__box" style = { styles } >
                    <form onSubmit = { this.onSearchSubmit }
                    className = "search__box-form"
                    autoComplete = "off" >
                    <Autosuggest suggestions = { this.suggestions }
                    getSuggestionValue = { this.getSuggestionValue }
                    onSuggestionSelected = { this.onSuggestionSelected }
                    onSuggestionsFetchRequested = { this.onSuggestionsFetchRequested }
                    onSuggestionsClearRequested = { this.onSuggestionsClearRequested }
                    alwaysRenderSuggestions = {true}
                    renderSuggestion = { this.renderSuggestion }
                    inputProps = { inputProps }
                    ref = "search" />

                     </form>

                    <div className = "search__send-button__div" >
                        <button 
                            className = "search__send-button"
                            onClick = { this.onSearchSubmit }
                            type = "submit" >
                            <img src = { `${window.icnThemePath}img/search_grey.svg` } className = "search__icon__button" / >
                        </button> 
                    </div>
                </div> 
            </div>
        );
    }

    onChange() {
        this.setState({
            searching: AppStore.isSearching(),
            searchTerm: AppStore.getSearchTerm()
        });
    }

    onToggleSearch(e) {
        if (e.shiftKey) {
            Actions.trigger(ActionTypes.TOGGLE_MATRIX);
        } else {
            Actions.trigger(ActionTypes.TOGGLE_SEARCH);
        }
    }

    onSearch(event) {
        if (event.target.className == 'search__box-input') {
            this.setState({ searchTerm: event.target.value });
        } else {
            this.setState({ searchTerm: event.target.textContent });
        }
    }

    onClearSearch(e) {
        this.onToggleSearch(e);
        Actions.trigger(ActionTypes.PERFORM_SEARCH, '');

    }

    onSearchSubmit(event) {
        event.preventDefault();
        Actions.trigger(ActionTypes.PERFORM_SEARCH, this.state.searchTerm.trim());
        this.onToggleSearch(event);
    }
}
