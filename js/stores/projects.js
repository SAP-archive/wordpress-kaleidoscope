require('core-js');

import {
    PARTICLE_SIZE,
    SCROLL_PADDING,
    SUBFILTER_MINWIDTH,
    SCALE_MIN,
    IS_MOBILE
} from '../constants/constants';

import Actions from "../actions/Actions";
import { ActionTypes } from "../constants/constants";

/*
 *  exports:
 *
 *  projects,
 *  filters,
 *  particleScroller,
 *
 */



// main projects array sorted by portfolio area

let projects = window.icnAllProjects;
var filter_rule = window.portfolio_filter_rule;
if (!["AND", "OR"].includes(filter_rule)){
  filter_rule = "AND";
}

let aboutProject;

var latinize = require('latinize');

projects.forEach(function(item, index) {
        if (item.slug === "about") {
            aboutProject = item;
            aboutProject.aboutTitle = JSON.parse(aboutProject.tags)[0] ? JSON.parse(aboutProject.tags)[0].name : "found no tag in about post";
            aboutProject.aboutProject = true;
            aboutProject.portfolioAreaClass = "dummy";
            projects.splice(index, 1);
            return true;
        }
    })
    // let lockedProjects = [];

// console.log('locked: ', localStorage.getItem('locked'));
if (localStorage.getItem('locked') === 'true') {
    projects = projects.filter(function(project) {
        return project.visibility === 'public';
    });
}

// set bubble color group order to order of filter items in filterbar
var filterIndexToSortBubblesBy;

for(var i = 0; i< window.mainFilters.length; i++) {
	if (mainFilters[i].title==window.portfolio_coloredByElement) {
		filterIndexToSortBubblesBy = i;
		break;
	}
}

var filterOrder = Object.keys(mainFilters[filterIndexToSortBubblesBy]["items"]);

projects.sort(function(a, b) {
  /*
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    return 0;

    */

    if (Array.isArray(a[window.portfolio_coloredByElement]) && Array.isArray(b[window.portfolio_coloredByElement])) {
        if (filterOrder.indexOf(a[window.portfolio_coloredByElement][0]) > filterOrder.indexOf(b[window.portfolio_coloredByElement][0])) {
          return 1;
        } else if (filterOrder.indexOf(a[window.portfolio_coloredByElement][0]) < filterOrder.indexOf(b[window.portfolio_coloredByElement][0])) {
          return -1;
        } else {
          if (a.title > b.title) {
            return 1;
          } else if (a.title < b.title) {
            return -1;
          }
        }
    } else {
        if (filterOrder.indexOf(a[window.portfolio_coloredByElement]) > filterOrder.indexOf(b[window.portfolio_coloredByElement])) {
            return 1;
        } else if (filterOrder.indexOf(a[window.portfolio_coloredByElement]) < filterOrder.indexOf(b[window.portfolio_coloredByElement])) {
            return -1;
        } else {
            if (a.title > b.title) {
                return 1;
            } else if (a.title < b.title) {
                return -1;
            }
        }
    }
    return 0;
    
});

// build filters object
let filters = {};

var activeFilterType = [];
var filterTypes = (function(mainFilters) {
    if (!Array.isArray(mainFilters)) {
        return undefined;
    }
    return mainFilters.map(f => {
        activeFilterType.push(!!f.isActive);
        return f.title;
    }).filter(t => {
        return !!t;
    });
})(window.mainFilters);


filterTypes.forEach(function(type) {
    var items = (function(mainFilters, filterType) {
        return mainFilters.filter(f => {
            return f.title === filterType;
        })[0].items;
    })(window.mainFilters, type);
    if (!items) items = [];
    if (!Array.isArray(items) && typeof items === 'object') items = Object.keys(items);
    filters[type] = {};
    items.forEach(i => {
        filters[type][i] = [];
    })
});

let portfolioItems = window.mainFilters.filter(item => {
    return item.title.toLowerCase() === window.portfolio_coloredByElement;
})[0]['items'];
if (!Array.isArray(portfolioItems) && typeof portfolioItems === 'object') {
    portfolioItems = Object.keys(portfolioItems);
}
let portfolioCategories = portfolioItems.reduce((prev, current, curIdx) => {
    prev[current.toLowerCase().replace(/\W/g, '')] = 'category_' + (curIdx < 10 ? '0' + curIdx : curIdx);
    return prev;
}, {});
portfolioCategories.dummy = "category_xx";
// Particle Scroller



let particleScroller = {};
let windowHeight = window.innerHeight,
    windowWidth = window.innerWidth,
    width = windowWidth / 2,
    height = windowHeight / 2,
    minDim = width > height ? height : width,
    domWidth = windowWidth - 2 * SCROLL_PADDING(),
    numCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.98)),
    secondRownumCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.88)),
    numRows = Math.ceil(projects.length / numCols),
    domHeight = numRows * PARTICLE_SIZE() + SCROLL_PADDING() / 2;

projects.initParticles = function() {

    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    width = windowWidth / 2;
    height = windowHeight / 2;
    minDim = width > height ? height : width;
    domWidth = windowWidth - 2 * SCROLL_PADDING();
    numCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.98));
    secondRownumCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.93));
    numRows = Math.ceil(projects.length / numCols);
    domHeight = numRows * PARTICLE_SIZE() + SCROLL_PADDING() / 2;
    particleScroller.oldX = undefined;
    particleScroller.oldY = undefined;

    particleScroller = {
        numRows,
        numCols,
        secondRownumCols,
        size: (minDim * minDim / 2) + (300 * 300),
        reset: function() {
            particleScroller.domHeight = domHeight + height;
            particleScroller.domWidth = domWidth + 2.5 * SCROLL_PADDING() + width + 100;
            particleScroller.scrollLeft = (width / -2) + 50;
            particleScroller.scrollTop = (height / -2);
            particleScroller.animation = '';
            particleScroller.currentRow = 0;
            particleScroller.currentCol = 0;
        }
    };

    particleScroller.reset();
    // init projects and collect all possible filters
    projects.forEach((proj, projIndex) => {
        // set animtion
        proj.animation = '';

        // calculate initial position
        let numCols = particleScroller.numCols;

        // let numRows = particleScroller.numRows;
        proj.initialTop = particleScroller.currentRow * (PARTICLE_SIZE() - 25) + SCROLL_PADDING() + height / 2;
        proj.initialLeft = particleScroller.currentCol * PARTICLE_SIZE() + SCROLL_PADDING() + SCROLL_PADDING() / 2 + width / 2; // + windowWidth/2;
        proj.withFilterLeft = null;
        if (particleScroller.currentRow % 2 === 0) {
            proj.initialLeft += PARTICLE_SIZE() / 2 + 6.6;
        }
        particleScroller.currentCol += 1;
        if ((particleScroller.currentCol === particleScroller.numCols && particleScroller.currentRow % 2 === 0) || (particleScroller.currentCol >= particleScroller.secondRownumCols)) {
            particleScroller.currentCol = 0;
            particleScroller.currentRow += 1;
        }
        proj.nextTop = proj.initialTop;
        proj.nextLeft = proj.initialLeft;

        // create portfolio area class
        let portfolioArea = ""
        if (typeof proj[window.portfolio_coloredByElement] === 'string') {
            portfolioArea = proj[window.portfolio_coloredByElement].toLowerCase();
        } else {

            portfolioArea = proj[window.portfolio_coloredByElement][0].toLowerCase();
        }
        proj.portfolioAreaClass = portfolioArea.replace(/\W/g, '');

        // create filters
        filterTypes.forEach(function(filterGroup) {
            if (!Array.isArray(proj[filterGroup])) {
                proj[filterGroup] = [proj[filterGroup]];
            }
            /*
            if (filterGroup === "portfolio_area" && proj[filterGroup].length > 1){
                proj[filterGroup] = proj[filterGroup].slice(0,1);
            }
            */
            proj[filterGroup].forEach(function(filter) {
                if (filter) {
                    if (typeof filter === "object") {
                        if (mainFilters[mainFilters.map(function(e) { return e.title; }).indexOf(filterGroup)].filter_attribute == undefined) {
                          filter = filter[filterGroup + "_name"];
                        } else {
                          var filterItem = mainFilters[mainFilters.map(function(e) { return e.title; }).indexOf(filterGroup)];
                          if (filterItem.filter_key && filterItem.filter_value && filter[filterItem.filter_key] == filterItem.filter_value) {
                            filter = filter[filterItem.filter_attribute];
                          } else {
                            return;
                          }
                        }
                    }
                    if (!filters[filterGroup][filter]) {
                        filters[filterGroup][filter] = [];
                    }
                    filters[filterGroup][filter].width = SUBFILTER_MINWIDTH + 'px';
                    filters[filterGroup][filter].possible = true;
                    filters[filterGroup][filter].push(projIndex);
                }
            });
        });

        // create search blob
        proj.searchstr = "";
        var searchStringItems = window.portfolio_searchStringLocked;
        if (localStorage.getItem('locked') === "false") {
            searchStringItems = window.portfolio_searchString;
        }

        searchStringItems.forEach(function(item, index) {
            if (item) {
                if (item === "tags") {
                    proj.searchstr += JSON.parse(proj.tags).map(function(x) {
                        return x.name;
                    }).join();
                } else if (proj[item].join && proj[item].length > 0 && Object.keys(proj[item][0]).some(function(k) {
                        return ~k.indexOf("_name")
                    })) {
                    var nameKey = "";
                    Object.keys(proj[item][0]).forEach(function(keyItem) {
                        if (keyItem.indexOf("_name") !== -1) {
                            nameKey = keyItem;
                        }
                    })
                    proj.searchstr += proj[item] ? proj[item].map(function(x) {
                        return x[nameKey];
                    }).join() : "";

                } else {
                    proj.searchstr += proj[item].join ? proj[item].join() : proj[item];
                }
            }
        });

        proj.searchstr = latinize(proj.searchstr.toLowerCase()).replace(/[^a-z0-9]/g, '');
    });

    domHeight = particleScroller.currentRow * PARTICLE_SIZE() + SCROLL_PADDING() / 2;
    particleScroller.domHeight = domHeight + height;
}


// --- INTIALIZE PARTICLES ---
projects.initParticles();


projects.searchFor = function(searchTerm, searchableProjectIndices){
  searchTerm = searchTerm.toLowerCase().replace(/[^a-z0-9 ]/g, '');

  let visibleProjects = [];
  let searchableProjects = [];
  if (searchableProjectIndices !== undefined) {
      searchableProjects = searchableProjectIndices.map(function(index) {
          projects[index].originalIndex = index
          return projects[index];
      })

  } else {
      searchableProjects = projects;
  }
  searchableProjects.forEach((proj, index) => {
      //if (proj.searchstr.indexOf(searchTerm) > -1) {
      if (searchTerm.split(" ").reduce((prev, curr) => {
              return proj.searchstr.indexOf(curr) >= 0 && prev;
          }, true)) {
          if (searchableProjectIndices) {
              visibleProjects.push(searchableProjects[index].originalIndex);
          } else {
              visibleProjects.push(index);
          }
      }
  });

  return visibleProjects;
}

// filter by search text
projects.performSearch = function(searchTerm, searchableProjectIndices) {

  let visibleProjects = projects.searchFor(searchTerm, searchableProjectIndices);

  if (visibleProjects.length === 0 && visibleProjects !== undefined) {
      Actions.trigger(ActionTypes.NORESULTS_TRUE);
  } else {
      Actions.trigger(ActionTypes.NORESULTS_FALSE);
  }
  return visibleProjects;
};


projects.countFilterResults = function(selectedFilters) {
  let visibleProjects = [];

  // filter_strategy: AND or OR
  let filter_strategy = {};
  filter_strategy["OR"] = function(prev, curr){ return curr || prev };
  filter_strategy["AND"] = function(prev, curr){ return curr && prev };

  // for each project: check if it fits
  for (let i = 0; i < projects.length; i++) {
    let projectMatchesFilters = true;
    filterTypes.forEach(function(filterGroup) {
        // collect subfilters of the current filterGroup/filterType from the selectedFilters
        let subfilters = selectedFilters.map(function(filter) {
            if (filter.filterTitle === filterGroup) return filter.subFilter;
        }).filter(function(n) {
            return n != undefined
        });
        if (subfilters.length === 0) return;

        // check if all (AND) subfilters match the current project
        let subFilterMatches = subfilters.map(function(subfilter) {
          // subfilter exists and project is part of the current subfilter
          return filters[filterGroup][subfilter] && filters[filterGroup][subfilter].includes(i);
        });

        let allSubfiltersMatch = false;
        allSubfiltersMatch = subFilterMatches.reduce(filter_strategy[filter_rule]);

        // update project matching status with the current filtergroup matching
        projectMatchesFilters = (projectMatchesFilters && allSubfiltersMatch);
    });

    if (projectMatchesFilters) visibleProjects.push(i);
  }

  //3. apply search
  selectedFilters.forEach(function(item, index) {
      if (item.filterTitle === "search" && item.subFilter.indexOf("search: ") !== -1) {
          var sSearchTerm = item.subFilter.slice(8, item.subFilter.length);
          visibleProjects = projects.searchFor(sSearchTerm, visibleProjects);
      }
  })

  return visibleProjects.length;
}


// apply sub filters
projects.performSubFilterSwitch = function(selectedFilters) {
    let visibleProjects = [];

    // filter_strategy: AND or OR
    let filter_strategy = {};
    filter_strategy["OR"] = function(prev, curr){ return curr || prev };
    filter_strategy["AND"] = function(prev, curr){ return curr && prev };

    // for each project: check if it fits
    for (let i = 0; i < projects.length; i++) {
      let projectMatchesFilters = true;
      // check all filterGroups
      filterTypes.forEach(function(filterGroup) {
        	// collect subfilters of the current filterGroup/filterType from the selectedFilters
          let subfilters = selectedFilters.map(function(filter) {
              if (filter.filterTitle === filterGroup) return filter.subFilter;
          }).filter(function(n) {
              return n != undefined
          });
          if (subfilters.length === 0) return;

          // check if all (AND) subfilters match the current project
          let subFilterMatches = subfilters.map(function(subfilter) {
            // subfilter exists and project is part of the current subfilter
            return filters[filterGroup][subfilter] && filters[filterGroup][subfilter].includes(i);
          });

          let allSubfiltersMatch = false;
          allSubfiltersMatch = subFilterMatches.reduce(filter_strategy[filter_rule]);

          // update project matching status with the current filtergroup matching
          projectMatchesFilters = (projectMatchesFilters && allSubfiltersMatch);
      });

      if (projectMatchesFilters) visibleProjects.push(i);
    }

    //2. apply search
    selectedFilters.forEach(function(item, index) {
        if (item.filterTitle === "search" && item.subFilter.indexOf("search: ") !== -1) {
            var sSearchTerm = item.subFilter.slice(8, item.subFilter.length)
            visibleProjects = projects.performSearch(sSearchTerm, visibleProjects)
        }
    })

    // 3. for each filter and subfilter check if it has a possible result
    filterTypes.forEach(function(filterGroup) {
        Object.keys(filters[filterGroup]).forEach(function(subfilter) {
            if (subfilter === 'active') return;

            let matched = false;
            filters[filterGroup][subfilter].forEach(function(i) {
                if (visibleProjects.includes(i)) {
                    matched = true;
                }
            });

            if (matched) {
                filters[filterGroup][subfilter].possible = true;
            } else {
                filters[filterGroup][subfilter].possible = false;
            }
        });
    });

    return visibleProjects;
}

projects.reorderProjectParticles = function(filterOffset = 0) {
    // compute new bubble-layout
    let fullHDWidth = 1920;
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    width = windowWidth / 2;
    height = windowHeight / 2;
    minDim = width > height ? height : width;
    domWidth = windowWidth - filterOffset - 2.5 * SCROLL_PADDING();
    numCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.98));
    secondRownumCols = Math.round(domWidth / (PARTICLE_SIZE() * 0.93));
    numRows = Math.ceil(projects.length / numCols);
    domHeight = numRows * PARTICLE_SIZE() + SCROLL_PADDING() / 2;
    particleScroller.oldX = undefined;
    particleScroller.oldY = undefined;

    particleScroller = {
        numRows,
        numCols,
        secondRownumCols,
        size: (minDim * minDim / 2) + (300 * 300),
        reset: function() {
            particleScroller.domHeight = domHeight + height;
            particleScroller.domWidth = domWidth + 2.5 * SCROLL_PADDING() + width + 100;
            particleScroller.scrollLeft = (width / -2) + 50;
            particleScroller.scrollTop = (height / -2);
            particleScroller.animation = '';
            particleScroller.currentRow = 0;
            particleScroller.currentCol = 0;
        }
    };

    particleScroller.reset();
    // init projects and collect all possible filters
    projects.forEach((proj, projIndex) => {
        // set animtion
        proj.animation = '';

        // calculate initial position
        let numCols = particleScroller.numCols;
        let translateLeft = 0;
        let translateTop = 0;

        // let numRows = particleScroller.numRows;
        translateTop = particleScroller.currentRow * (PARTICLE_SIZE() - 25) + SCROLL_PADDING() + height / 2;
        if (windowWidth > fullHDWidth) {
            translateLeft = particleScroller.currentCol * PARTICLE_SIZE() + (1.5 * SCROLL_PADDING());
            translateLeft += Math.abs(filterOffset);
        } else {
            translateLeft = particleScroller.currentCol * PARTICLE_SIZE() + (2 * SCROLL_PADDING());
            translateLeft += Math.abs(filterOffset);
        }

        // proj.withFilterLeft = null;
        if (particleScroller.currentRow % 2 === 0) {
            translateLeft += PARTICLE_SIZE() / 2 + 6.6;
        }
        particleScroller.currentCol += 1;
        if ((particleScroller.currentCol === particleScroller.numCols && particleScroller.currentRow % 2 === 0) || (particleScroller.currentCol >= particleScroller.secondRownumCols)) {
            particleScroller.currentCol = 0;
            particleScroller.currentRow += 1;
        }

        proj.initialTop = translateTop;
        proj.initialLeft = translateLeft;
        proj.nextTop = proj.initialTop;
        proj.nextLeft = proj.initialLeft;
    });

    domHeight = particleScroller.currentRow * PARTICLE_SIZE() + SCROLL_PADDING() / 2;
    particleScroller.domHeight = domHeight + height;
}

projects.alignProjectsToFilterBar = function(oIScroller, filterOverview) {
    var scrollerX = oIScroller.x;
    var minDist = Infinity;
    var filterOffset = document.getElementsByClassName("filters") && document.getElementsByClassName("filters").length > 0 ? document.getElementsByClassName("filters")[0].offsetWidth : 0;
    var particleSize = PARTICLE_SIZE() * SCALE_MIN;
    if (IS_MOBILE()) {
        filterOffset = filterOffset / 2;
    }

    projects.reorderProjectParticles(filterOffset);
}

// place projects according to the applied filter
projects.reorgProjects = function(visibleProjects, iScroll) {
    var filterOffset = 0;
    let filterNodes = document.getElementsByClassName("filters");
    if (filterNodes && filterNodes[0]){
      filterOffset = filterNodes[0].offsetWidth;
    }
    // var activeFilter = document.getElementsByClassName("activefilters")[0];
    // if (activeFilter) {
    //     activeFilter.style.left = filterOffset + "px";
    // }

    filterOffset = filterOffset + 80;
    // 1. make non visible projects invisible
    projects.forEach(function(proj, index) {
        if (visibleProjects.indexOf(index) > -1) {
            proj.cssVisibility = "visible"
        } else {
            proj.cssVisibility = "hidden"
        }
    });

    // 2. optimally place visible projects
    let domWidth = windowWidth - 2 * SCROLL_PADDING();
    if (!IS_MOBILE()) {
        domWidth -= 250;
    }
    let numCols = Math.round(domWidth / PARTICLE_SIZE());
    numCols = (numCols <= 0 ? 1 : numCols);
    let numRows = Math.ceil(visibleProjects.length / numCols);

    visibleProjects.forEach(function(objIndex, posIndex) {
        let currentRow = Math.floor(posIndex / numCols);
        let currentCol = posIndex - currentRow * numCols;

        projects[objIndex].nextTop = currentRow * PARTICLE_SIZE() + SCROLL_PADDING() + 100 + 30;
        projects[objIndex].nextLeft = currentCol * PARTICLE_SIZE() + SCROLL_PADDING() + filterOffset;
        projects[objIndex].fixScale = 0.9;
    });


    // 3. adjust scroll height to new layout
    let newDomHeight = numRows * PARTICLE_SIZE() + 2 * SCROLL_PADDING();
    particleScroller.domHeight = newDomHeight < windowHeight ? windowHeight + SCROLL_PADDING() / 2 : newDomHeight;
    particleScroller.domWidth = domWidth + 2.5 * SCROLL_PADDING();
    if (typeof particleScroller.oldX === 'undefined') {
        particleScroller.oldX = iScroll.x
        particleScroller.oldY = iScroll.y
    }
    iScroll.y = 0;
    iScroll.x = 0;
    setTimeout(() => iScroll.refresh(), 200);

}


// reset filters
projects.resetFilters = function(filterOverview, iScroll) {

    projects.forEach(function(proj) {
        proj.animation = '';
        proj.nextTop = proj.initialTop;
        proj.nextLeft = filterOverview ? proj.initialLeft : proj.withFilterLeft || proj.initialLeft;
        proj.fixScale = 0;
        proj.cssVisibility = "visible"
    });
    if (!(typeof particleScroller.oldX === 'undefined')) {
        iScroll.x = particleScroller.oldX;
        iScroll.y = particleScroller.oldY;
        particleScroller.oldX = undefined;
        particleScroller.oldY = undefined;
    }
    particleScroller.reset();


    filterTypes.forEach(function(filterGroup) {
        Object.keys(filters[filterGroup]).forEach(function(subfilter) {
            filters[filterGroup][subfilter].possible = true;
        });
    });

};


// reset all animations
projects.resetAnimations = function() {
    projects.forEach(function(proj) {
        proj.animation = '';
    });
}


export { projects, aboutProject, filters, particleScroller, filterTypes, portfolioCategories, activeFilterType };
