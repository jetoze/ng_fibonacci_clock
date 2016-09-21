'use strict'

var HOUR_COLOR = '#FF0000';
var MINUTE_COLOR = '#00FF00';
var HOUR_AND_MINUTE_COLOR = '#0000FF';
var NO_COLOR = '#FFFFFF';

// Represents a timestamp that is rendered by the clock. The resolution is 5 minutes,
// since the minute part represents every 5 minutes.
function RenderedTime(hour, minute) {
	this.hour = hour;
	this.minute = minute;
	this.hourParts = [];
	this.minuteParts = [];
}

function getColor(timeToRender, rect) {
	var hourSet = timeToRender.hourParts.includes(rect);
	var minuteSet = timeToRender.minuteParts.includes(rect);
	if (hourSet && minuteSet) {
		return HOUR_AND_MINUTE_COLOR;
	} else if (hourSet) {
		return HOUR_COLOR;
	} else if (minuteSet) {
		return MINUTE_COLOR;
	} else {
		return NO_COLOR;
	}
};

function getHours(time) {
	var h = time.getHours();
	if (h > 12) {
		h -= 12;
	}
	return h;
}

angular.module('fibonacciClock').
	component('clock', {
		templateUrl: 'clock/clock.template.html',
		bindings: {
			boxSize: '<',
			borderSize: '<',
			digitalFontSize: '<'
		},
		controller: ['Clock', '$interval', function(Clock, $interval) {
			this.boxSize = 50;
			this.borderSize = 4;
			this.digitalFontSize = 16;
			this.hours = -1;
			this.minutes = -1;
			this.ampm = 'AM';
			// Keeps track of the last time that was rendered. We use this to switch the display
			// only when the time actually changes. Otherwise the clock would constantly change
			// appearance with the same frequency as our animation, since we pick a random 
			// combination each time. 
			this.lastRenderedTime = new RenderedTime(-1, -1);

			this.getTimeToRender = function() {
				var now = Clock.now();
				console.log(now);
				this.hours = getHours(now);
				this.minutes = now.getMinutes();
				this.ampm = now.getHours() < 12 ? 'AM' : 'PM';
				var timeToRender = new RenderedTime(this.hours, Math.floor(this.minutes / 5));
				if ((timeToRender.hour === this.lastRenderedTime.hour) && (timeToRender.minute === this.lastRenderedTime.minute)) {
					timeToRender = lastRenderedTime;
					console.log('No change to render');
				} else {
					timeToRender.hourParts = Clock.decompose(timeToRender.hour);
					timeToRender.minuteParts = Clock.decompose(timeToRender.minute);
					this.lastRenderedTime = timeToRender;
					console.log('Hours: ' + timeToRender.hour + ' -> ' + timeToRender.hourParts);
					console.log('Minutes: ' + now.getMinutes() + ' -> ' + timeToRender.minute + ' -> ' + timeToRender.minuteParts);
				}
				return timeToRender;
			};

			this.updateDisplay = function(timeToRender) {
				this.oneA_Bg = getColor(timeToRender, "1a");
				this.oneB_Bg = getColor(timeToRender, "1b");
				this.two_Bg = getColor(timeToRender, "2");
				this.three_Bg = getColor(timeToRender, "3");
				this.five_Bg = getColor(timeToRender, "5");
			};

			this.update = function() {
				var timeToRender = this.getTimeToRender();
				this.updateDisplay(timeToRender);
				this.boxSize += 10;
			};

			this.minuteDisplay = function() {
				return this.minutes < 10 ? '0' + this.minutes : '' + this.minutes;
			};

			this.update();

			/* FIXME: The following doesn't work. I get an error like this in the console:
						"TypeError: Cannot read property 'getTimeToRender' of undefined"
			var fn = this.update;
			$interval(fn, 1000);
			*/
			// HACK: Do it like this for now. Not pretty, obviously, since we're duplicating code.
			var self = this;
			$interval(function() {
				var timeToRender = self.getTimeToRender();
				self.updateDisplay(timeToRender);
			}, 1000);
		}]
	});
