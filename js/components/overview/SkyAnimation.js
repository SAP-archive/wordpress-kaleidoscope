import "!style!raw!sass!./overview.scss"
import React from "react";


export default class SkyAnimation extends React.Component {

   constructor(props) {
        super(props);

        this.onHeliClick = this.onHeliClick.bind(this);
        this.onDroneClick = this.onDroneClick.bind(this);

        var self = this;

		this.NUMBER_OF_CLOUDS = 10;
		this.CLOUD_LEFT_START = -window.innerWidth / 3;
		this.HELI_MARGIN = -200;

		this.getCloudDescription = function(startLeft = Math.random()*window.innerWidth) {
		return {
    				speed: Math.random() * 100.0,
    				left: startLeft,
    				top: Math.random()*window.innerHeight / 10*5 + window.innerHeight / 10*1,
    				type: Math.random() > 0.5 ? "cloud_single" : "cloud_formation"
    		};
		}

    	this.state = {
	    		heli: {
	    			left: 100,
	    			speed: 200,
	    			clicked: false
	    		},
	    		clouds: Array.from(Array(this.NUMBER_OF_CLOUDS)).map(function(){
	    			return self.getCloudDescription();
			    	}).sort(function(a,b){
			    		return a.speed - b.speed;
			    	}),
			    drone: {
			    	left: 50,
			    	top: 200,
			    	clicked: false
			    }
    		};
    }
	
	componentDidMount() {
		var self = this;

		setInterval(function() {
			if (self.props.animating) {
				let ns = self.state; 

				ns.heli.left += ns.heli.speed;
				if (ns.heli.left > window.innerWidth - self.HELI_MARGIN || ns.heli.left < self.HELI_MARGIN) {
					ns.heli.speed *= -1;
				}

				ns.drone.left = window.innerWidth * Math.random();
				ns.drone.top = Math.random() * window.innerHeight / 10 * 6 + window.innerHeight / 10 * 1;

				for (var i=0; i<self.NUMBER_OF_CLOUDS; i++) {
					if (ns.clouds[i].left > window.innerWidth) {
						ns.clouds[i].left = self.CLOUD_LEFT_START;
						ns.clouds[i].top = self.getCloudDescription().top;
						continue;
					}
					ns.clouds[i].left += (ns.clouds[i].speed +  10 * window.innerHeight / ns.clouds[i].top) / 2.0 ;
				}

				//self.forceUpdate();
				self.setState(ns);
			}
		}, 2500);
    }

    showToastMessage(msg) {
	    let oToast = document.getElementsByClassName("kaleidoscope_toast");
	    oToast[0].innerText = msg;
	    setTimeout(() => oToast[0].style.display = "none", 3700);
	    oToast[0].style.display = "block";
    }

    onHeliClick() {
    	let ns = this.state; 
    	ns.heli.clicked = true;
		this.setState(ns);
    	setTimeout(() => {
	    	let ns = this.state; 
	    	ns.heli.clicked = false;
			this.setState(ns);
    	}, 3000);
    }

    onDroneClick() {
    	let ns = this.state; 
    	ns.drone.clicked = true;
		this.setState(ns);
    	setTimeout(() => {
	    	let ns = this.state; 
	    	ns.drone.clicked = false;
			this.setState(ns);
    	}, 1000);
    }

	render() {
		let styleHelicopter = {
			left: this.state.heli.left,
			transform: 'scaleX( ' + (this.state.heli.speed < 0 ? -1 : 1) + ' ) rotate(20deg)'
		};
		let styleDrone = {
			left: this.state.drone.left,
			top: this.state.drone.top
		};

		var clouds = [];
		for (var i = 0; i<this.NUMBER_OF_CLOUDS; i++) {
			let cloudStyle = {
				top: this.state.clouds[i].top,
				left: this.state.clouds[i].left,
				transform: 'scale( ' + (this.state.clouds[i].speed / 100.0 * 1.8 + 0.5) + ' )'
			}
			let cloudClass = "overview__cloud " + this.state.clouds[i].type;
			if (this.state.clouds[i].left == this.CLOUD_LEFT_START) {
				cloudClass += " no_transition";
			}
			clouds.push( <div style={cloudStyle} className={cloudClass} key={'cloud_'+i}></div> );
        }

        return (
        	<div>
        		{clouds}
        		<div style={styleDrone} className={`overview__drone ${this.state.drone.clicked ? "drone_clicked" : ""}`} onClick={this.onDroneClick}><div className={`drone_flash`}></div></div>
        		<div style={styleHelicopter} className={`overview__helicopter ${this.state.heli.clicked ? "heli_clicked" : ""}`} onClick={this.onHeliClick}></div>
            </div>
        )
    }
}
